# Contributing

## Development

### installation

```
yarn
```

### USAGE

**For web**

```
yarn start
```

**For web (without SSR)**

```
yarn start:dev
```


**For desktop**

```
yarn start:desktop
```

Open console with `ctrl+maj+I`.  
To see changes:`ctrl+R` .

**For smartphone**

There're requirements to build and run a cordova app, follow installation instructions from [cordova website](https://cordova.apache.org/docs/en/latest/guide/cli/index.html#install-pre-requisites-for-building).

Sometimes it is required to install or update plugins and platforms by running:

```
yarn cordova prepare
```

For android, when `yarn cordova requirements` is ok and if you have [AVD and a working emulated
android](https://developer.android.com/studio/run/managing-avds.html), you may want to launch the stack:

```
yarn start:smartphone
```

_(Other platforms are not yet supported)_

The app is launched every time you change a file. If you prefer control when the app is reloaded,
launch the following commands:

```
yarn build:smartphone:dev
yarn cordova emulate android --debug
```

### Troubleshoutings

**Android SDK Build-tools**

The following error may appears when running emulation:

```
Exception in thread "main" java.lang.UnsupportedClassVersionError: com/android/dx/command/Main : Unsupported major.minor version 52.0
```

It sounds like "Android SDK Build-tools" (v24.0.3) fails with cordova, ionic, ...  
With Android SDK Manager, downgrade to v23.0.3 and remove the latest one.
