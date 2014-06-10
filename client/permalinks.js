
document.queryAll('h1[id], h2[id], h3[id], h4[id], h5[id], h6[id]').forEach(function (h) {
  var a = document.createElement('a')
  a.href = '#' + h.id
  a.textContent = '#'
  a.className = 'header-permalink'
  h.appendChild(a)
})
