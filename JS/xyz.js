let XYZ = {

  cnsl: {

    log(text) {
      // Log types
      let log = 'color:#888;font-size:15px;'
      let warn = 'color:#e00000;font-size:20px;background-color:red;'
      // Styling the XYZ tag
      let xCSS = 'color:rgb(203, 63, 80);font-size:15px;'
      let yCSS = 'color:rgb(119, 215, 103);font-size:15px;'
      let zCSS = 'color:rgb(37, 105, 195);font-size:15px;'
      // XYZ tag at the start of a message
      let xyzTag = '%c[%cX%cY%cZ%c] %s'
      // Sending the message to the log
      let type = log;
      console.log(xyzTag, type, xCSS, yCSS, zCSS, type, text);
    },

    help() {
      XYZ.cnsl.log(`this is a help command :)`)
    },

    XYZdata() {
      for (const [key, value] of Object.entries(XYZdata)) {
        XYZ.cnsl.log(`${key}: ${value}`);
      }
    }

  },

  init: {

    loadXYZdata() {
      fetch('/XYZdata.json')
        .then(response => response.json())
        .then(data => XYZdata = data)
        .catch(console.error);
    },

    XYZLoadLayout(url) {
      let layout = XYZdata.layout;
      let xyzBody = $('body')
      let xyzHead = $('head')

      // Inserts HEAD file
      fetch('/assets/html/head.html')
        .catch((err) => {
          XYZ.cnsl.log('Error fetching head')
        })
        .then(response => response.text())
        .then(text => {
          xyzHead.insertAdjacentHTML('beforeend', text)
        })

      // Inserts Layout file
      if (layout === undefined) {
        currentLayout = "default"
        fetch(url + 'default.html')
          .catch((err) => {
            XYZ.cnsl.log('Error fetching layout')
          })
          .then(response => response.text())
          .then(text => {
            xyzBody.insertAdjacentHTML('beforeend', text)
          })
        XYZ.cnsl.log('Layout = default');
      } else {
        currentLayout = layout
        fetch(url + layout + '.html')
          .catch((err) => {
            XYZ.cnsl.log('Error fetching layout')
          })
          .then(response => response.text())
          .then(text => {
            xyzBody.insertAdjacentHTML('beforeend', text)
          })
        XYZ.cnsl.log('Layout = ' + layout);
      }


      XYZ.cnsl.log('Page succesfully built');
    },

    setSiteTheme() {
      var element = $('html');
      if (XYZdata.theme === undefined) {
        element.classList.add(`default-theme`);
      } else {
        element.classList.add(`${XYZdata.theme}`)
      }
    },

    mergeData() {
      Object.assign(XYZdata, p);
      delete p;
    },

    setTitle() {
      if (XYZdata.pageName !== undefined) {
        document.title = XYZdata.siteName + ' | ' + XYZdata.pageName;
        XYZ.cnsl.log('Title set');
      } else {
        return;
      }
    }

  }

}

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

XYZ.init.loadXYZdata();

//// CUSTOM ELEMENTS
class XYZTime extends HTMLElement {
  connectedCallback() {
    let date = new Date(this.getAttribute('datetime') || Date.now());
    this.innerHTML = new Intl.DateTimeFormat("default", {
      year: this.getAttribute('year') || undefined,
      month: this.getAttribute('month') || undefined,
      day: this.getAttribute('day') || undefined,
      hour: this.getAttribute('hour') || undefined,
      minute: this.getAttribute('minute') || undefined,
      second: this.getAttribute('second') || undefined,
      timeZoneName: this.getAttribute('time-zone-name') || undefined,
    }).format(date);
  }
}
class XYZVariable extends HTMLElement {
  connectedCallback() {
    let variable = this.getAttribute('var')
    this.innerHTML = XYZdata[variable] || "";
  }
}
class XYZNavbar extends HTMLElement {
  connectedCallback() {
    // Sets active page in navbar
    let current_location = location.pathname;
    if (current_location === "/") return;
    let nav_items = this.getElementsByTagName("a");
    for (let i = 0, len = nav_items.length; i < len; i++) {
      if (nav_items[i].getAttribute("href").indexOf(current_location) !== -1) {
        nav_items[i].className = "currentPage";
      }
    }
  }
}
class XYZLogo extends HTMLElement {
  connectedCallback() {
    let xyzlogo = `<a href="https://xyz.vuw.nu"><span>X</span><span>Y</span><span>Z</span></a>`
    this.innerHTML = xyzlogo;
  }
}
class XYZInclude extends HTMLElement {
  connectedCallback() {
    let source = this.getAttribute('src')

    fetch(source)
      .then(response => response.text())
      .then(text => {
        this.innerHTML = text
      });
  }
}
class XYZQuery extends HTMLElement {
  connectedCallback() {
    const source = this.getAttribute('src')
    const key = this.getAttribute('key')
    const urlParams = new URLSearchParams(window.location.search);
    const value = urlParams.get(key)
    if (value === null) {
      return;
    } else {
    fetch(source + value)
      .then(response => response.text())
      .then(text => {
        this.innerHTML = text
      });
    }
  }
}
class XYZInsert extends HTMLElement {
  connectedCallback() {
    const output = $('xyz-insert');
    const inputID = this.getAttribute('input');
    const input = $(inputID);

    while (input.childNodes.length > 0) {
      output.appendChild(input.childNodes[0]);
    }
    input.remove();
  }
}
// Defining all custom elements
function defineElements() {
  customElements.define("xyz-time", XYZTime); // Time Element
  customElements.define("xyz-v", XYZVariable); // Variable Element
  customElements.define("xyz-nav", XYZNavbar); // Navbar Element
  customElements.define("xyz-logo", XYZLogo); // Logo Element
  customElements.define("xyz-include", XYZInclude); // Include Element
  customElements.define("xyz-query", XYZQuery); // Include Element
  customElements.define("xyz-insert", XYZInsert); // Include Element
}

// Text loader
function loadPage(url, output) {
  fetch("/assets/html/includes/" + url)
    .then(response => response.text())
    .then(text => {
      $(output).innerHTML = text
    })
    .catch((err) => {
      $(output).innerHTML = "Can’t access " + url + " response. Blocked by browser?"
    });
}



// //SearchParams Test
// const params = new URLSearchParams(window.location.search);
//
// //Iterate the search parameters.
// for (const param of params) {
//   console.log(param);
// }


//// INITIALISATION
window.addEventListener('DOMContentLoaded', (event) => {

  setTimeout(() => {
    defineElements(); //Function to define all custom elements
    XYZ.init.mergeData(); //Combines page data into XYZdata object
    XYZ.init.setSiteTheme();
    XYZ.init.setTitle();
    if (XYZdata.layout !== 0) {
      XYZ.init.XYZLoadLayout('/assets/html/layouts/');
    } else {
      return;
    }
    XYZ.cnsl.log(`XYZ has loaded for ${XYZdata.siteName}`);
  }, 100);

});
