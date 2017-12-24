var objectValues = require('object-values')
var html = require('choo/html')

var imageLightbox = require('../components/image-lightbox')
var imageGrid = require('../components/image-grid')
var utilsContent = require('../utils/content')
var video = require('../components/video')

module.exports = view

function view (state, emit) {
  var page = state.page

  if (state.query.image) {
    return imageLightbox({
      image: page.files[state.query.image],
      handleClick: function () {
        emit(state.events.PUSHSTATE, page.url)
      }
    })
  }

  var images = utilsContent.shuffle(
    objectValues(page.files).filter(file => file.type === 'image')
  )

  return html`
    <div class="ttu">
      <div class="x xjb p0-5 fs2">
        <div class="p0-5">${page.title}</div>
        <div class="p0-5">
          <a href="/" class="tdn fc-white">Index</a>
        </div>
      </div>
      ${objectValues(page.pages).map(function (page) {
        page = state.content[page.url]
        return html`<a href="${page.url}">${page.name}</a>`
      })}
      ${page.sources ? createVideos() : ''}
      ${page.setlist ? createSetlist() : ''}
      ${imageGrid({
        images: images
      })}
      <ol class="p1">
        ${images.map(function (file, i) {
          return html`<li class="x">  
            <div class="c2">${('0'+i).slice(-2)}</div>
            <div class="c10">${file.filename}</div>
          </li>`
        })}
      </ol>
    </div>
  `

  function createVideos () {
    return page.sources.map(function (source) {
      return video(source, {
        textOffline: state.content['/'].offline,
        online: state.online,
        ratio: page.ratio
      })
    })
  }

  function createSetlist () {
    return html`
      <div class="x c12 p0-5">
        <div class="c3 p0-5">
          Setlist
        </div>
        <ol class="c9 py0-5">
          ${objectValues(page.setlist).map(function (song, i) {
            return html`<li class="x c12">  
              <div class="c4 px0-5">${('0'+i).slice(-2)}</div>
              <div class="c8 px0-5">${song}</div>
            </li>`
          })}
        </ol>
      </div>
    `
  }
}
