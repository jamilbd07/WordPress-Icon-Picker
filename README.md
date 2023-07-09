# WordPress Icon Picker

A simple and reusable Icon Picker component for WordPress & Gutenberg

## Installation

The package can be installed via [npm](https://github.com/npm/cli):

```
npm install wordpress-icon-picker --save
```

Or via [yarn](https://github.com/yarnpkg/yarn):

```
yarn add wordpress-icon-picker
```

You’ll need to install React inside your WordPress environment. In your react component where you want to show the iconpicker, add the code like below: 

```js
import { useState } from "@wordpress/element";
import {IconPicker} from "wordpress-icon-picker";

const Example = () => {
  const [icon, setIcon] = useState('');
  return (
    <IconPicker
		value={icon}
        onChange={(value) =>
            setIcon(value)
        }
        title={"Select Icon"} //optional
        showHeading={true} //optional
    />
  );
};
```

To display Icon, add the code like below in your component.
```js
import {DisplayIcon} from "wordpress-icon-picker";

const Example = () => {
  return (
    <DisplayIcon icon={icon} />
  );
};
```

## License

Copyright (c) 2023 individual contributors. Licensed under MIT license, see [LICENSE](LICENSE) for the full license.