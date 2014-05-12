
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

function home() {
  var filename = process.cwd() + '/home/index.jade'
  var html = jade.render(fs.readFileSync(filename, 'utf8'), {
    filename: filename
  })
  fs.writeFileSync(process.cwd() + '/index.html', html)
}

function docs() {
  var filename = process.cwd() + '/docs/index.jade'
  var html = jade.render(fs.readFileSync(filename, 'utf8'), {
    filename: filename
  })
  fs.writeFileSync(process.cwd() + '/docs.html', html)
}

home()
docs()

sane(process.cwd(), [
  '*.jade',
  'docs/*',
  'home/*',
])
.on('change', function (filepath) {
  console.log('%s changed, rebuilding', filepath)
  home()
  docs()
})
