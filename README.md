<img src='https://image.flaticon.com/icons/svg/477/477131.svg' width='128' height='128' />

# js-scarecrow
JS fail safe apis access proxy wrapper

Proxy wrapper for properties invocation that may not exist <br />
somewhere in the invocation(a.b.c().d = 1) chain i.e is **undefined**.

### Use case
Best example would be hosted iframe, injected with services from the hosting application.<br />
In case the iframe gets updated with wrong version, you might have calls to none existing services apis,<br />
you get application crash.<br />

Provides error free, logged access to invalid services or general apis,<br />
From high level injected services down to bare native js bones.<br />
Have async promise? response is fail safe as well ;)<br />

Scarecrow wont fix the logical bug,<br />
but it would allow the application to skip the null pointer exceptions.<br />
logs any invalid function calls, property gets/sets.<br />

### Getting started
```console
npm install js-scarecrow

yarn add js-scarecrow
```

### Usage
```javascript
import { InjectionProxy } from "js-scarecrow";

const services = InjectionProxy({
          injector: (serviceName) => AwesomeInjector.get(serviceName),
        });

services.NonExistingService.NonExistingApi().NonExistingProp;
services.ExistingService.AsyncApi().then(response => response.NonExistingPropA.NonExistingPropB);
```

### Custom Logger
```javascript
import { InjectionProxy } from "js-scarecrow";

const logWarn = (...args) => console.warn(...args);
const logFatal = (...args) => console.error(...args);

const services = InjectionProxy({
          injector: (serviceName) => AwesomeInjector.get(serviceName),
          onGetMissingService: logFatal,
          GetMissingPropertyMsg: logWarn,
          SetMissingPropertyMsg: logWarn,
          CallMissingMethodMsg: logFatal,
        });

services.NonExistingService.NonExistingApi("Parzeval").NonExistingProp = "Ender";
```
```console
Console:
Getting non-existing service "NonExistingService"
Getting non-existing property "NonExistingApi"
Executing non-existing method: "NonExistingApi" on this: {...} with arguments: ["Parzeval"]
Setting non-existing property "NonExistingProp", value: "Ender"
```
### Object Proxy
```javascript
import { ObjectProxy } from "js-scarecrow";

const logWarn = (...args) => console.warn(...args);
const logFatal = (...args) => console.error(...args);

const proxiedObject = new Proxy(myService, new ObjectProxy({
          GetMissingPropertyMsg: logWarn,
          SetMissingPropertyMsg: logWarn,
          CallMissingMethodMsg: logFatal
        }));

proxiedObject.NonExistingApi("Parzeval").NonExistingProp = "Ender";
```
```console
Console:
Getting non-existing property "NonExistingApi"
Executing non-existing method: "NonExistingApi" on this: {...} with arguments: ["Parzeval"]
Setting non-existing property "NonExistingProp", value: "Ender"
```
