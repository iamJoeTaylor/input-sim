# Input-Sim

This simulates a HTMLInputElement (type text) in memory. This allows you to
run events, key combinations, or methods on it to affect the input's value
and selected range.

## Usage

### Keys
```js
InputSim.KEYS
```

Is a Constant that provides some keyCode mappings and methods.

```js
InputSim.KEYS.isDigit(keyCode); // Boolean
InputSim.KEYS.isDirectional(keyCode); // Boolean
```

### Input
```js
InputSim.Input
```

This is the class you can use to create your input instances from.

```js
var input = new InputSim.Input('Mos Eisley');
```

There are many methods available to control and modify this input.

```js
input.deleteWordForward(); // input.text() -> 'Mos '
```

Please see our [documentation](docs/) for a more in depth overview.

## Pull Requests

1. Fork it
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin my-new-feature`)
5. Create new Pull Request

Any contributors to the master esnext repository must sign the [Individual
Contributor License Agreement (CLA)][cla].  It's a short form that covers our
bases and makes sure you're eligible to contribute.

[cla]: https://spreadsheets.google.com/spreadsheet/viewform?formkey=dDViT2xzUHAwRkI3X3k5Z0lQM091OGc6MQ&ndplr=1

When you have a change you'd like to see in the master repository, [send a pull
request](https://github.com/iamJoeTaylor/input-sim/pulls). Before we merge your
request, we'll make sure you're in the list of people who have signed a CLA.
