
module throttle from 'https://nlz.io/github/component/per-frame/*/index.js'

import 'https://nlz.io/github/jonathanong/delegated-dropdown/0/index.js'

import 'permalinks.js'

var html = document.documentElement
var toc = document.querySelector('#toc')
var menu = document.querySelector('#toc .Dropdown-menu')
if (toc) {
  // create the #toc
  var frag = document.createDocumentFragment()
  ;[].forEach.call(document.querySelectorAll('section h2[id]'), function (h) {
    var a = document.createElement('a')
    a.className = 'Dropdown-item'
    a.href = '#' + h.id
    a.title = a.textContent = h.firstChild.textContent
    frag.appendChild(a)
  })
  menu.appendChild(frag)

  // apply listeners
  window.addEventListener('scroll', throttle(function () {
    setMaxHeight()
    setAffix()
  }))

  window.addEventListener('resize', throttle(function () {
    setMaxHeight()
  }))

  // to do: automatically reapply max height whenever the dropdown is open
  // because iOS seems to be debouncing these events themselves or something
}

// make it sticky. to do: use position: sticky; if available
function setAffix() {
  html.classList[window.scrollY > 134 ? 'add' : 'remove']('toc-fixed')
}

// change dropdown max-height
function setMaxHeight() {
  var maxHeight = window.innerHeight
    - toc.getBoundingClientRect().top // #toc top
    - 40 // .Dropdown-toggle height
    - 20 // border from bottom
  menu.style['max-height'] = maxHeight + 'px'
}
