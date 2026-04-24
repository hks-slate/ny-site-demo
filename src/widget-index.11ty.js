const fs = require('fs');
const path = require('path');

module.exports = class {
  data() {
    const widgetsDir = path.join(__dirname, 'assets/widgets');
    const widgets = fs.readdirSync(widgetsDir)
      .filter(f => f.endsWith('.js'))
      .map(f => f.replace('.js', ''));

    return {
      permalink: '/assets/widget-index.json',
      eleventyExcludeFromCollections: true,
      widgets
    };
  }

  render({ widgets }) {
    return JSON.stringify(widgets);
  }
};
