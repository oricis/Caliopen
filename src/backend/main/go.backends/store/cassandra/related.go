/*
 * // Copyleft (ɔ) 2018 The Caliopen contributors.
 * // Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
 * // license (AGPL) that can be found in the LICENSE file.
 */

package store

import (
	"fmt"
	. "github.com/CaliOpen/Caliopen/src/backend/defs/go-objects"
	"github.com/gocassa/gocassa"
	"github.com/mitchellh/hashstructure"
	"gopkg.in/oleiade/reflections.v1"
	"reflect"
)

type relatedReference struct {
	Keys      map[string]string
	Object    HasTable
	Relations []gocassa.Relation
	Table     string
}

// UpdateRelated ensure that tables related (joined) to obj are up to date in db,
// ie related objects are updated, created or deleted accordingly.
func (cb *CassandraBackend) UpdateRelated(new, old HasRelated, isNew bool) error {
	oldRelateds := map[uint64]relatedReference{}
	if isNew {
		MarshalRelated(new)
	} else {
		// build a map with old's relateds list to find if some relateds have been deleted in new
		for oldRelated := range old.GetSetRelated() {
			ref := relatedReference{
				Keys:      map[string]string{},
				Object:    oldRelated.(HasTable),
				Relations: []gocassa.Relation{},
			}
			ref.Table, ref.Keys, _ = oldRelated.(HasTable).GetTableInfos()

			// build relations to select the right row
			relations := map[string]interface{}{}
			for property, key := range ref.Keys {
				value, err := reflections.GetField(oldRelated, property)
				if err == nil {
					ref.Relations = append(ref.Relations, gocassa.Eq(key, value))
					relations[key] = value
				}
			}
			hash, err := hashstructure.Hash(relations, nil)
			if err == nil {
				oldRelateds[hash] = ref
			}
		}
	}

	for newRelated := range new.GetSetRelated() {
		if rel, ok := newRelated.(HasTable); ok {
			table, mapKeys, _ := rel.GetTableInfos()

			// build gocassa Table object
			keys := []string{}
			for _, key := range mapKeys {
				keys = append(keys, key)
			}
			T := cb.IKeyspace.Table(table, rel, gocassa.Keys{
				PartitionKeys: keys,
			}).WithOptions(gocassa.Options{TableName: table}) // need to overwrite default gocassa table naming convention

			err := T.Set(rel).Run()
			if err != nil {
				return fmt.Errorf("[CassandraBackend] UpdateRelated: %s", err)
			}

			if !isNew {
				// remove keys from oldRelated
				// thus oldRelateds map will only holds remaining entries that are not in the new state
				relations := map[string]interface{}{}
				for property, key := range mapKeys {
					value, err := reflections.GetField(newRelated, property)
					if err == nil {
						relations[key] = value
					}
				}
				hash, err := hashstructure.Hash(relations, nil)
				if err == nil {
					delete(oldRelateds, hash)
				}

			}
		}
	}

	if len(oldRelateds) > 0 {
		// it remains relateds in the map, meaning these relateds have been removed from contact
		// need to delete related in joined table
		for _, related := range oldRelateds {
			// build gocassa Table object
			keys := []string{}
			for _, key := range related.Keys {
				keys = append(keys, key)
			}
			T := cb.IKeyspace.Table(related.Table, related.Object, gocassa.Keys{
				PartitionKeys: keys,
			}).WithOptions(gocassa.Options{TableName: related.Table}) // need to overwrite default gocassa table naming convention

			// delete row
			err := T.Where(related.Relations...).Delete().Run()
			if err != nil {
				return fmt.Errorf("[CassandraBackend] UpdateRelated: %s", err)
			}
		}
	}

	return nil
}

// RetrieveRelated fetches rows from related (joined) table(s) and embeds rows into obj.
func (cb *CassandraBackend) RetrieveRelated(obj HasRelated) error {

	for field, related := range obj.GetRelatedList() {
		if rel, ok := related.(HasTable); ok {
			table, partitionKeys, collectionKeys := rel.GetTableInfos()

			// build gocassa Table object
			keys := []string{}
			for _, key := range partitionKeys {
				keys = append(keys, key)
			}
			T := cb.IKeyspace.Table(table, rel, gocassa.Keys{
				PartitionKeys: keys,
			}).WithOptions(gocassa.Options{TableName: table}) // need to overwrite default gocassa table naming convention

			// build relations to select right rows
			relations := []gocassa.Relation{}
			for property, key := range collectionKeys {
				value, err := reflections.GetField(obj, property)
				if err == nil {
					relations = append(relations, gocassa.Eq(key, value))
				}
			}

			// retrieve rows
			rows := new([]map[string]interface{})
			err := T.Where(relations...).Read(rows).Run()
			if err != nil {
				return fmt.Errorf("[CassandraBackend] UpdateRelated: %s", err)
			}

			// put rows (of unknown type at compilation) into obj
			embeddedSlice, err := reflections.GetField(obj, field)

			// Create a slice to begin with
			embeddedSliceType := reflect.TypeOf(embeddedSlice)
			toEmbed := reflect.MakeSlice(embeddedSliceType, 0, 1) // set capacity as needed
			// Create a pointer to the slice value
			p := reflect.New(toEmbed.Type())
			// Set the pointer to the slice (otherwise, my_slice would be 'un-addressable')
			p.Elem().Set(toEmbed)
			if err == nil {
				for _, row := range *rows {
					rel.UnmarshalCQLMap(row)
					toEmbed = reflect.Append(toEmbed, reflect.Indirect(reflect.ValueOf(rel)))
				}
			}
			reflections.SetField(obj, field, toEmbed.Interface())

		}
	}
	return nil
}

// DeleteRelated ensure that tables related (joined) to obj are up to date in db,
// ie related objects are deleted accordingly.
func (cb *CassandraBackend) DeleteRelated(obj HasRelated) error {

	for related := range obj.GetSetRelated() {
		if rel, ok := related.(HasTable); ok {

			table, mapKeys, _ := rel.GetTableInfos()

			// build gocassa Table object
			keys := []string{}
			for _, key := range mapKeys {
				keys = append(keys, key)
			}
			T := cb.IKeyspace.Table(table, rel, gocassa.Keys{
				PartitionKeys: keys,
			}).WithOptions(gocassa.Options{TableName: table}) // need to overwrite default gocassa table naming convention

			// build relations to select the right row
			relations := []gocassa.Relation{}
			for property, key := range mapKeys {
				value, err := reflections.GetField(obj, property)
				if err == nil {
					relations = append(relations, gocassa.Eq(key, value))
				}
			}

			// delete row
			err := T.Where(relations...).Delete().Run()
			if err != nil {
				return fmt.Errorf("[CassandraBackend] UpdateRelated: %s", err)
			}
		}
	}
	return nil
}
