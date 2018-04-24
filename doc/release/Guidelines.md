## GIT Taging

- each package version have its own git tag in form of :  
`<ressource>.<package_name>-<version>`  
*\<ressources\>* values are names of the subdirectories under /src/ :  `backend/components/`, `frontends/web_app/` …

- each global release have its git tag in form of :  
    `release-<version>`

## Versioning
Caliopen follows the [semver](http://semver.org/)'s Semantic Versioning rules.

#### Python versioning

- pre-requisites:

each python package **MUST** have in the `__init__.py` file on it's exposed namespace :
    
```
__version__ = 'x.x.x'
```

package's `setup.py` must expose package version using reading of this version number.

- create a tag for a python package:  
    - update `__version__` number with relevant version # in `__init__.py` file
    - create the git tag
