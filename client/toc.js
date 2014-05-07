
import 'https://nlz.io/github/jonathanong/delegated-dropdown/0/index.js'
import 'https://nlz.io/github/polyfills/polyfills/1/classList.js'

import 'permalinks.js'

var toc = document.querySelector('#toc')
if (toc) {
// how do i do early return statements in es6?

{ // create the #toc
  var frag = document.createDocumentFragment()

  ;[].forEach.call(document.querySelectorAll('section h2[id]'), function (h) {
    var a = document.createElement('a')
    a.className = 'Dropdown-item'
    a.href = '#' + h.id
    a.title = a.textContent = h.firstChild.textContent
    frag.appendChild(a)
  })

  toc.querySelector('.Dropdown-menu').appendChild(frag)
}

var html = document.documentElement
// ios is broken
if (navigator.userAgent.match(/(iPad|iPhone|iPod)/g)) {
  html.className = ' suck-it-ios'
} else { // sticky #toc
  document.addEventListener('scroll', function () {
    html.classList[window.scrollY > 134 ? 'add' : 'remove']('toc-fixed')
  })
}

}
