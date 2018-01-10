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
	"gopkg.in/oleiade/reflections.v1"
	"reflect"
)

// UpdateRelated ensure that tables related (joined) to obj are up to date in db,
// ie related objects are updated, or created if isNew is true.
func (cb *CassandraBackend) UpdateRelated(obj HasRelated, isNew bool) error {
	if isNew {
		MarshalRelated(obj)
	}
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

			err := T.Set(rel).Run()
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

			// build relations to select right row
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
