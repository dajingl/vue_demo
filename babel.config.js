module.exports = {
    plugins: [
      ['import', {
        libraryName: 'vant',
        libraryDirectory: 'es',
        style: name => `${name}/style/less`
      }, 'vant']
    ]
  };