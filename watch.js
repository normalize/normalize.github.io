
var fs = require('fs')
var sane = require('sane')
var jade = require('jade')
var marked = require('marked')
var highlight = require('highlight.js')

marked.setOptions({
  highlight: function (code) {
    return highlight.highlightAuto(code).value
  }
})

var dirs = [
  'index',
  'api',
  'guide',
  'about',
]

var fns = dirs.map(function (dir) {
  return function() {
    var filename = process.cwd() + '/' + dir + '/index.jade'
    var html = jade.render(fs.readFileSync(filename, 'utf8'), {
      filename: filename
    })
    fs.writeFileSync(process.cwd() + '/' + dir + '.html', html)
  }
})

fns.forEach(function (fn) {
  fn()
})

sane(process.cwd(), ['*.jade'].concat(dirs.map(function (dir) {
  return dir + '/*'
})))
.on('change', function (filepath) {
  console.log('%s changed, rebuilding', filepath)
  fns.forEach(function (fn) {
    fn()
  })
})
