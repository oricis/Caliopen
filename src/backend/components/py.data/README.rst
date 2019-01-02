Caliopen data package
=====================

This package contain base structure to build caliopen DataProvider object.

This kind of object must implement a given interface

Examples
--------

File provider
~~~~~~~~~~~~~

```
from caliopen_data import FileDataProvider

class CaliopenFile(FileDataProvider):

    def _format_item(self, item):
        return item.upper()

f = CaliopenFile({})
f.prepare('README.md')

for item in f.next():
    print(item)
```

Elasticsearch provider
~~~~~~~~~~~~~~~~~~~~~~

```
from caliopen_storage.config import Configuration
from caliopen_data import ESProvider
import elasticsearch_dsl as dsl


class ESQuery(ESProvider):

    def _format_item(self, item):
        return [",".join(x['label'] for x in item.participants)]


provider = ESQuery(Configuration('global').configuration)


query = dsl.Search().filter('term', body_plain="think")

provider.prepare(query, index=None, doc_type='indexed_message')
for item in provider.next():
    print(item)
```
