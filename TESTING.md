## Testing compass with fake sensors

**high frequency sensor with 90 degree randomization on angle readings**
```js
setInterval(() => {
    const angle = Math.random() * 90;
    const event = new DeviceOrientationEvent('deviceorientation', {
        alpha: angle,
        beta: 0,
        gamma: 0,
        absolute: true
    });
    window.dispatchEvent(event);
}, 10);
```

**high frequency sensor with 15 degree randomization on angle readings**
```js
setInterval(() => {
    const angle = Math.random() * 15;
    const event = new DeviceOrientationEvent('deviceorientation', {
        alpha: angle,
        beta: 0,
        gamma: 0,
        absolute: true
    });
    window.dispatchEvent(event);
}, 10);
```


## Testing GPS movement

**Make a GPS trace and loop through it to set the device position**
```js

```