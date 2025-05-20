class EventDriver {
  constructor() {
    this.mouseX = Number.POSITIVE_INFINITY;
    this.mouseY = Number.POSITIVE_INFINITY;
    this.mousePressed = [];
    this.startTouchX = 0;
    this.startTouchY = 0;
    this.isKeyPressed = {};

    this.addIn("mousedown", {
      fn: (e) => {
        this.mousePressed[e.button] = true;
      },
    });

    this.addIn("mouseup", {
      fn: (e) => {
        this.mousePressed[e.button] = false;
      },
    });

    this.addIn("mousemove", {
      fn: (e) => {
        this.mouseX = e.clientX;
        this.mouseY = e.clientY;
      },
    });

    this.addIn("keydown", {
      fn: (e) => {
        this.isKeyPressed[e.key] = true;
      },
    });

    this.addIn("keyup", {
      fn: (e) => {
        this.isKeyPressed[e.key] = false;
      },
    });

    this.addIn("touchstart", {
      fn: (e) => {
        this.startTouchX = e.touches[0].clientX;
        this.startTouchX = e.touches[0].clientY;
        this.isTouchDevice = true;
      },
    });

    this.addIn("touchmove", {
      fn: (e) => {
        this.touchX = e.touches[0].clientX;
        this.touchY = e.touches[0].clientY;
        this.deltaTouchX = this.touchX - this.startTouchX;
        this.deltaTouchY = this.touchY - this.startTouchY;
      },
    });

    this.addIn("resize", {
      fn: () => {
        this.isTouchDevice = false;
      },
    });
  }

  #toTrigger(nameEvent, listener) {
    if (typeof listener == "function") {
      listener = {
        index: this[`${nameEvent}_listeners`],
        trigger: listener,
      };
    }
    return listener;
  }

  get mouseLeftPressed() {
    return this.mousePressed[0];
  }

  get mouseMiddlePressed() {
    return this.mousePressed[1];
  }

  get mouseRightPressed() {
    return this.mousePressed[2];
  }

  searchIn(nameEvent, { fn, index }) {
    const array = this[`${nameEvent}_listeners`];
    if (index != null) {
      return array[index];
    } else if (fn != null) {
      return array.find((l) => l.trigger === fn);
    }
  }

  removeOf(nameEvent, { fn, index }) {
    const array = this[`${nameEvent}_listeners`];
    if (index != null) {
      array.splice(index, 1);
    } else if (fn != null) {
      this[`${nameEvent}_listeners`] = array.filter((l) => l.trigger !== fn);
    }
    return this;
  }

  addIn(namesEvent, { fn, index, component }) {
    if (typeof namesEvent == "string") {
      namesEvent = [namesEvent];
    }
    if (!component) {
      component = window;
    }
    namesEvent.forEach((nameEvent) => {
      if (this[`${nameEvent}_listeners`] === undefined) {
        this[`${nameEvent}_listeners`] = [];
        component.addEventListener(nameEvent, (event) => {
          this[`${nameEvent}_listeners`].forEach((listener) => {
            listener.trigger(event);
          });
        });
      }
      const array = this[`${nameEvent}_listeners`];
      if (index != null && fn != null) {
        array.splice(index, 0, this.#toTrigger(nameEvent, fn));
      } else if (fn != null) {
        array.push(this.#toTrigger(nameEvent, fn));
      }
    });
    return this;
  }

  remove_all_listeners() {
    for (const arr in this) {
      if (arr.endsWith("_listeners")) {
        this[arr] = [];
      }
    }
  }
}

const driver = new EventDriver();

export default driver;
