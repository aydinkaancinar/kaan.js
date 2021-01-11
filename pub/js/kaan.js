"use strict";

(function (global, document, $) {
  var _down = false;
  var _mousePosition;
  var _offset = [0, 0];
  var _x;
  var _y;

  //tools
  function _getRGB(red, green, blue) {
    var r = Number(red).toString(16);
    r = r.length == 1 ? "0" + r : r;
    var g = Number(green).toString(16);
    g = g.length == 1 ? "0" + g : g;
    var b = Number(blue).toString(16);
    b = b.length == 1 ? "0" + b : b;
    var hex = "#" + r + g + b;
    return hex;
  }

  function _avgOfCenters(x1, y1, w1, h1, x2, y2, w2, h2) {
    const x = (x1 + w1 / 2 + (x2 + w2 / 2)) / 2;
    const y = (y1 + h1 / 2 + (y2 + h2 / 2)) / 2;
    return [x, y];
  }

  var _mouseDownFunc = function (env) {
    return function (e) {
      _down = true;
      _x = e.clientX + document.documentElement.scrollLeft - env.div.offsetLeft;
      _y =
        env.height -
        (e.clientY + document.documentElement.scrollTop - env.div.offsetTop);
      var i = 0;
      for (i = 0; i < env.items.length; i++) {
        if (env.items[i].isClicked(_x, _y, 0, 0)) {
          _offset = [
            env.items[i].div.offsetLeft - e.clientX,
            env.items[i].div.offsetTop - e.clientY,
          ];
        }
      }
    };
  };

  var _mouseUpFunction = function (env) {
    return function () {
      _down = false;
      env.applyGravity();
    };
  };

  var _mouseMoveFunction = function (env) {
    return function (event) {
      event.preventDefault();
      _x =
        event.clientX +
        document.documentElement.scrollLeft -
        env.div.offsetLeft;
      _y =
        env.height -
        (event.clientY +
          document.documentElement.scrollTop -
          env.div.offsetTop);
      if (_down) {
        var i;
        for (i = 0; i < env.items.length; i++) {
          var position = env.items[i].position;
          var height = env.items[i].height;
          _x =
            event.clientX +
            document.documentElement.scrollLeft -
            env.div.offsetLeft;
          _y =
            env.height -
            (event.clientY +
              document.documentElement.scrollTop -
              env.div.offsetTop);
          if (env.items[i].isClicked(_x, _y, 0, 0)) {
            if (env.items[i].type === "solid" && env.items[i].movable) {
              const other1 = env.items[i].isColliding();
              _mousePosition = {
                x: event.clientX,
                y: event.clientY,
              };
              _y = env.height - height - (_mousePosition.y + _offset[1]);
              _x = _mousePosition.x + _offset[0];
              if (other1 !== []) {
                const other = other1[0];
                if (typeof other !== "undefined") {
                  if (other.type === "solid") {
                    if (other.position.x < env.items[i].position.x) {
                      if (_x < env.items[i].position.x) {
                        _x = position.x;
                      }
                    } else {
                      if (_x > env.items[i].position.x) {
                        _x = position.x;
                      }
                    }
                    if (other.position.y < env.items[i].position.y) {
                      if (_y < env.items[i].position.y) {
                        _y = position.y;
                      }
                    } else {
                      if (_y > env.items[i].position.y) {
                        _y = position.y;
                      }
                    }
                  }
                  const product = env.items[i].getProduct(other);
                  if (product !== null) {
                    env.initiateReaction(env.items[i], other, product);
                    product.isFalling = false;
                  }
                }
              }
              position.x = _x;
              position.y = _y;
              env.items[i].div.style.left = position.x + "px";
              env.items[i].div.style.bottom = position.y + "px";
            }
          }
        }
      }
    };
  };

  function Enviroment(name, height, width, color, temparature, gravity) {
    this.frame;
    this.div;
    this.name = name;
    this.items = [];
    this.height = height;
    this.width = width;
    this.color = color;
    this.temparature = temparature;
    this.gravity = gravity;
    this.start = false;
  }

  Enviroment.prototype = {
    createEnviroment: function () {
      const enviroment = document.createElement("div");
      this.div = enviroment;
      enviroment.setAttribute("id", this.name + "enviroment");
      enviroment.style =
        "position: relative; border:1px solid #0f0; width: " +
        this.width +
        "px; height: " +
        this.height +
        "px; margin: 10px; background-color: " +
        this.color +
        ";";
      const nameBox = document.createElement("div");
      nameBox.innerText = this.name;
      nameBox.style =
        "text-align: center; padding:10px; color: white; background: black; display: inline-block";
      enviroment.append(nameBox);
      this.frame = document.getElementById(this.name);
      this.frame.append(enviroment);
      this.frame.style = "display: inline-block;";
      new Matter(
        this,
        600,
        10,
        0,
        0,
        "Grey",
        0,
        false,
        true,
        100000000,
        100000000
      ).createSolid();
      new Matter(
        this,
        5,
        285,
        0,
        10,
        "Grey",
        0,
        false,
        true,
        100000000,
        100000000
      ).createSolid();
      new Matter(
        this,
        5,
        285,
        595,
        10,
        "Grey",
        0,
        false,
        true,
        100000000,
        100000000
      ).createSolid();
      new Matter(
        this,
        600,
        5,
        0,
        295,
        "Grey",
        0,
        false,
        true,
        100000000,
        100000000
      ).createSolid();

      document.addEventListener("mousedown", _mouseDownFunc(this), true);

      document.addEventListener("mouseup", _mouseUpFunction(this), true);

      this.div.addEventListener("mousemove", _mouseMoveFunction(this), true);
    },

    itemsReactToTemp: function () {
      var i;
      for (i = 0; i < this.items.length; i++) {
        if (this.items[i].meltingTemp < this.temparature) {
          if (this.items[i].boilingTemp < this.temparature) {
            if (this.items[i].type !== "gas") {
              this.items[i].changeState("gas");
              console.log("gas");
            }
          } else {
            if (this.items[i].type !== "liquid") {
              this.items[i].changeState("liquid");
              console.log("liquid");
            }
          }
        } else {
          if (this.items[i].type !== "solid") {
            this.items[i].changeState("solid");
            console.log("solid");
          }
        }
      }
    },

    changeTemparature: function (temp) {
      this.temparature = temp;
      console.log(temp);
      this.itemsReactToTemp();
    },

    applyGravity: function () {
      if (this.start) {
        var i;
        for (i = 0; i < this.items.length; i++) {
          if (
            this.items[i].position.y > this.items[i].isLandingOn() &&
            !this.items[i].isFalling &&
            this.items[i].displayItem
          ) {
            this.items[i].isFalling = true;
            var fallTime =
              Math.sqrt((2 * this.items[i].position.y) / this.gravity) * 1000;
            const item = this.items[i];
            const env = this;
            var target = 0;
            if (item.type === "solid") {
              target = this.items[i].position.y - this.items[i].isLandingOn();
              item.position.y = item.isLandingOn();
            } else if (item.type === "liquid") {
              target = this.items[i].position.y;
              item.position.y = 0;
            }
            // I used jQuery here
            $(this.items[i].fullId).animate(
              { bottom: "-=" + target + "px" },
              fallTime,
              "swing",
              function () {
                item.isFalling = false;
                var itemsToApplyG = item.itemsAbove();
                itemsToApplyG.push(item);
                env.applyGravityOnList(itemsToApplyG);
                if (item.type === "liquid") {
                  item.liquidMove();
                }
                if (item.type === "gas") {
                  item.gasMove();
                }
              }
            );
          }
        }
      }
    },

    applyGravityOnList: function (lst) {
      if (this.start) {
        var i;
        for (i = 0; i < lst.length; i++) {
          if (lst[i].position.y > lst[i].isLandingOn() && !lst[i].isFalling) {
            lst[i].isFalling = true;
            var fallTime =
              Math.sqrt((2 * lst[i].position.y) / this.gravity) * 1000;
            const item = lst[i];
            const env = this;
            var target = 0;
            if (item.type === "solid") {
              target = lst[i].position.y - lst[i].isLandingOn();
              item.position.y = item.isLandingOn();
            } else if (item.type === "liquid") {
              target = lst[i].position.y;
              item.position.y = 0;
            }
            // I used jQuery here
            $(lst[i].fullId).animate(
              { bottom: "-=" + target + "px" },
              fallTime,
              "swing",
              function () {
                item.isFalling = false;
                env.applyGravityOnList(item.itemsAbove());
                if (item.type === "liquid") {
                  item.liquidMove();
                }
                if (item.type === "gas") {
                  item.gasMove();
                }
              }
            );
          }
        }
      }
    },

    startEnviroment: function () {
      this.start = true;
      this.applyGravity();
      this.itemsReactToTemp();
    },

    initiateReaction: function (reactant1, reactant2, product) {
      if (reactant1.isColliding().includes(reactant2)) {
        this.removeItem(reactant1);
        this.removeItem(reactant2);
        const pos = _avgOfCenters(
          reactant1.position.x,
          reactant1.position.y,
          reactant1.width,
          reactant1.height,
          reactant2.position.x,
          reactant2.position.y,
          reactant2.width,
          reactant2.height
        );
        product.changePosition(
          pos[0] - product.width * 2,
          pos[1] - product.height * 2
        );
        product.showItem();
        this.applyGravity();
      }
    },

    removeItem: function (item) {
      item.div.remove();
      item.displayItem = false;
    },

    makeReaction: function (item) {
      const other = item.isColliding();
      if (other !== []) {
        var i;
        for (i = 0; i < other.length; i++) {
          const product = item.getProduct(other[i]);
          if (product !== null) {
            this.initiateReaction(item, other[i], product);
            product.isFalling = false;
          }
        }
      }
    },
  };

  function EnviromentController(enviroment) {
    this.enviroment = enviroment;
    this.div;
    this.tabs;
    this.screen;
  }

  EnviromentController.prototype = {
    create: function () {
      this.div = document.createElement("div");
      this.div.setAttribute("id", this.enviroment.name + "ec");
      const nameBox = document.createElement("div");
      nameBox.innerText = this.enviroment.name + " Controller";
      nameBox.style = "padding:10px; font-size: 1.5em; text-align: center;";
      this.div.append(nameBox);
      this.div.style =
        "border:1px solid #000; width: 600px; height: 300px; margin: 10px; background-color: Grey;";
      this.tabs = document.createElement("div");
      this.tabs.style =
        "border:1px solid #000; width: 586px; height: 30px; margin: 6px; background-color: Grey;";
      this.screen = document.createElement("div");
      this.screen.style =
        "border:1px solid #000; width: 586px; height: 200px; margin: 6px; background-color: Grey;";
      this.div.append(this.tabs);
      this.div.append(this.screen);
      new MatterCreator(this).create();
      this.enviroment.frame.append(this.div);
    },
  };

  function MatterCreator(ec) {
    this.ec = ec;
    this.div;
    this.form;
    this.colorSec;
    this.dimsSec;
    this.propsSec;
  }

  MatterCreator.prototype = {
    create: function () {
      this.div = document.createElement("div");
      this.form = document.createElement("form");
      const env = this.ec.enviroment;
      // Color Section
      this.colorSec = document.createElement("div");
      const colorSecTitle = document.createElement("div");
      colorSecTitle.innerText = "Color";
      colorSecTitle.style = "text-align: center; font-size: 1.5em";
      this.colorSec.style =
        "float: left; width: 31%; display: flex; flex-direction: column; flex-wrap: wrap; margin: 1%";
      const red = document.createElement("div");
      const redVal = document.createElement("input");
      redVal.setAttribute("id", this.ec.enviroment.name + "red");
      redVal.type = "range";
      redVal.max = 255;
      redVal.min = 0;
      redVal.onchange = function () {
        var hex = _getRGB(redVal.value, greenVal.value, blueVal.value);
        colorDisplay.style.background = hex;
      };
      const redValLabel = document.createElement("label");
      redValLabel.htmlFor = this.ec.enviroment.name + "red";
      redValLabel.innerText = "Red";
      const green = document.createElement("div");
      const greenVal = document.createElement("input");
      greenVal.setAttribute("id", this.ec.enviroment.name + "green");
      greenVal.type = "range";
      greenVal.max = 255;
      greenVal.min = 0;
      greenVal.onchange = function () {
        var hex = _getRGB(redVal.value, greenVal.value, blueVal.value);
        colorDisplay.style.background = hex;
      };
      const greenValLabel = document.createElement("label");
      greenValLabel.htmlFor = this.ec.enviroment.name + "green";
      greenValLabel.innerText = "Green";
      const blue = document.createElement("div");
      const blueVal = document.createElement("input");
      blueVal.setAttribute("id", this.ec.enviroment.name + "blue");
      blueVal.type = "range";
      blueVal.max = 255;
      blueVal.min = 0;
      blueVal.onchange = function () {
        var hex = _getRGB(redVal.value, greenVal.value, blueVal.value);
        colorDisplay.style.background = hex;
      };
      const blueValLabel = document.createElement("label");
      blueValLabel.htmlFor = this.ec.enviroment.name + "blue";
      blueValLabel.innerText = "Blue";
      const submit = document.createElement("input");
      submit.type = "submit";
      submit.value = "Create";
      submit.style = "width: 100%; margin-top: 10px";
      const colorDisplay = document.createElement("div");
      colorDisplay.style =
        "border:1px solid #000000; text-align: center; width: 100%; height: 20px; background-color: " +
        _getRGB(redVal.value, greenVal.value, blueVal.value) +
        ";";
      this.colorSec.append(colorSecTitle);
      this.colorSec.append(colorDisplay);
      red.append(redVal);
      red.append(redValLabel);
      this.colorSec.append(red);
      green.append(greenVal);
      green.append(greenValLabel);
      this.colorSec.append(green);
      blue.append(blueVal);
      blue.append(blueValLabel);
      this.colorSec.append(blue);
      // Size and Position
      this.dimsSec = document.createElement("div");
      const dimsSecTitle = document.createElement("div");
      dimsSecTitle.innerText = "Size & Position";
      dimsSecTitle.style = "text-align: center; font-size: 1.5em";
      this.dimsSec.style =
        "float: left; width: 31%; display: flex; flex-direction: column; flex-wrap: wrap; margin: 1%";
      const x = document.createElement("div");
      const xVal = document.createElement("input");
      xVal.setAttribute("id", this.ec.enviroment.name + "x");
      xVal.type = "range";
      xVal.max = 600;
      xVal.min = 0;
      xVal.onchange = function () {};
      const xValLabel = document.createElement("label");
      xValLabel.htmlFor = this.ec.enviroment.name + "x";
      xValLabel.innerText = "X-Pos";
      const y = document.createElement("div");
      const yVal = document.createElement("input");
      yVal.setAttribute("id", this.ec.enviroment.name + "y");
      yVal.type = "range";
      yVal.max = 300;
      yVal.min = 0;
      yVal.onchange = function () {};
      const yValLabel = document.createElement("label");
      yValLabel.htmlFor = this.ec.enviroment.name + "y";
      yValLabel.innerText = "Y-Pos";
      const h = document.createElement("div");
      const hVal = document.createElement("input");
      hVal.setAttribute("id", this.ec.enviroment.name + "height");
      hVal.type = "range";
      hVal.max = 100;
      hVal.min = 0;
      hVal.onchange = function () {};
      const hValLabel = document.createElement("label");
      hValLabel.htmlFor = this.ec.enviroment.name + "height";
      hValLabel.innerText = "Height";
      const w = document.createElement("div");
      const wVal = document.createElement("input");
      wVal.setAttribute("id", this.ec.enviroment.name + "width");
      wVal.type = "range";
      wVal.max = 100;
      wVal.min = 0;
      wVal.onchange = function () {};
      const wValLabel = document.createElement("label");
      wValLabel.htmlFor = this.ec.enviroment.name + "width";
      wValLabel.innerText = "Width";
      this.dimsSec.append(dimsSecTitle);
      x.append(xVal);
      x.append(xValLabel);
      this.dimsSec.append(x);
      y.append(yVal);
      y.append(yValLabel);
      this.dimsSec.append(y);
      h.append(hVal);
      h.append(hValLabel);
      this.dimsSec.append(h);
      w.append(wVal);
      w.append(wValLabel);
      this.dimsSec.append(w);
      // Properties
      this.propsSec = document.createElement("div");
      const propsSecTitle = document.createElement("div");
      propsSecTitle.innerText = "Properties";
      propsSecTitle.style = "text-align: center; font-size: 1.5em";
      this.propsSec.style =
        "float: left; width: 31%; display: flex; flex-direction: column; flex-wrap: wrap; margin: 1%";
      this.propsSec.append(propsSecTitle);
      const matterTypeSelector = document.createElement("select");
      const matterTypeSelectorSolid = document.createElement("option");
      const matterTypeSelectorLiquid = document.createElement("option");
      const matterTypeSelectorGas = document.createElement("option");
      matterTypeSelectorSolid.value = "Solid";
      matterTypeSelectorLiquid.value = "Liquid";
      matterTypeSelectorGas.value = "Gas";
      matterTypeSelectorSolid.innerText = "Solid";
      matterTypeSelectorLiquid.innerText = "Liquid";
      matterTypeSelectorGas.innerText = "Gas";
      const mass = document.createElement("div");
      mass.style = "margin-top: 5px";
      const massVal = document.createElement("input");
      massVal.setAttribute("id", "mass");
      massVal.style = "width: 65%";
      massVal.type = "text";
      massVal.placeholder = "enter a number";
      const massValLabel = document.createElement("label");
      massValLabel.htmlFor = "mass";
      massValLabel.innerText = "Mass";
      mass.append(massVal);
      mass.append(massValLabel);
      matterTypeSelector.append(matterTypeSelectorSolid);
      matterTypeSelector.append(matterTypeSelectorLiquid);
      matterTypeSelector.append(matterTypeSelectorGas);
      this.propsSec.append(matterTypeSelector);
      this.propsSec.append(mass);
      // appending to main elements
      this.form.append(this.colorSec);
      this.form.append(this.dimsSec);
      this.form.append(this.propsSec);
      this.form.append(submit);
      this.div.append(this.form);
      this.ec.screen.append(this.div);
      this.form.addEventListener("submit", function (e) {
        e.preventDefault();
        var hex = _getRGB(redVal.value, greenVal.value, blueVal.value);
        var x = xVal.value * 1;
        var y = yVal.value * 1;
        var h = hVal.value * 1;
        var w = wVal.value * 1;
        var mass = 0.0001;
        if (isNaN(massVal.value)) {
          mass = parseInt(massVal.value) * 1;
        }
        var type = matterTypeSelector.value;
        const matter = new Matter(env, w, h, x, y, hex, mass);
        if (type === "Solid") {
          matter.createSolid();
        } else if (type === "Liquid") {
          matter.createLiquid();
        } else if (type === "Gas") {
          matter.createGas();
        }
        matter.logProperties();
      });
    },
  };

  function Matter(
    enviroment,
    width,
    height,
    x,
    y,
    color = "White",
    mass = 0,
    movable = true,
    displayItem = true,
    name = "",
    meltingTemp = null,
    boilingTemp = null
  ) {
    this.name = name;
    this.type;
    this.movable = movable;
    this.mass = mass;
    this.enviroment = enviroment;
    this.height = height;
    this.width = width;
    this.color = color;
    this.position = { x: x, y: y };
    this.id = "";
    this.fullId = "";
    this.isFalling = false;
    this.div;
    this.displayItem = displayItem;
    this.reactions = [];
    this.meltingTemp = meltingTemp;
    this.boilingTemp = boilingTemp;
  }

  Matter.prototype = {
    createMatter: function (type) {
      this.type = type;
      this.id = this.enviroment.name + "matter" + this.enviroment.items.length;
      this.fullId = "#" + this.id;
      const matter = document.createElement("div");
      this.div = matter;
      matter.setAttribute("id", this.id);
      matter.style =
        "position: absolute; width: " +
        this.width +
        "px; height: " +
        this.height +
        "px; left: " +
        this.position.x +
        "px; bottom: " +
        this.position.y +
        "px; background-color: " +
        this.color +
        ";";
      this.enviroment.items.push(this);
      const enviromentDiv = this.enviroment.div;
      if (this.displayItem) {
        enviromentDiv.append(matter);
      }
    },

    createSolid: function () {
      this.createMatter("solid");
      this.enviroment.applyGravity();
      if (this.displayItem) {
        if (this.movable) {
          this.div.style.cursor = "pointer";
        }
      }
      if (this.boilingTemp === null) {
        this.boilingTemp = 200;
      }
      if (this.meltingTemp === null) {
        this.meltingTemp = 100;
      }
    },

    createLiquid: function () {
      this.createMatter("liquid");
      this.enviroment.applyGravityOnList([this]);
      this.movable = false;
      if (this.boilingTemp === null) {
        this.boilingTemp = 100;
      }
      if (this.meltingTemp === null) {
        this.meltingTemp = 0;
      }
    },

    liquidMove: function () {
      this.div.style.cursor = "default";
      const item = this;
      // I used jQuery here
      $(this.fullId).animate(
        {
          height: this.height + "px",
          width: "590px",
          opacity: 0.4,
          left: "5",
          top: 290 - this.height + "px",
        },
        1500,
        function () {
          item.position.x = 0;
          item.width = item.enviroment.width;
        }
      );
    },

    solidMove: function () {
      this.div.style.cursor = "default";
      const item = this;
      // I used jQuery here
      $(this.fullId).animate(
        {
          height: "50px",
          width: "50px",
          opacity: 1,
          left: "280px",
          top: 290 - this.height + "px",
        },
        1500,
        function () {
          item.position.x = 0;
          item.width = item.enviroment.width;
        }
      );
    },

    createGas: function () {
      this.createMatter("gas");
      this.enviroment.applyGravityOnList([this]);
      this.movable = false;
      if (this.boilingTemp === null) {
        this.boilingTemp = 0;
      }
      if (this.meltingTemp === null) {
        this.meltingTemp = -100;
      }
    },

    gasMove: function () {
      this.div.style.cursor = "default";
      const item = this;
      // I used jQuery here
      $(this.fullId).animate(
        {
          width: "590px",
          height: "285px",
          opacity: 0.1,
          left: "5",
          top: "5",
        },
        1500,
        function () {
          item.position.x = 0;
          item.width = item.enviroment.width;
          item.position.y = 0;
          item.height = item.enviroment.height;
          item.enviroment.makeReaction(item);
        }
      );
    },

    isClicked: function (x, y, w, h) {
      if (
        this.position.x <= x + w &&
        this.position.x + this.width >= x &&
        this.position.y <= y + h &&
        this.position.y + this.height >= y
      ) {
        return true;
      }
      if (this.position.x === x && this.position.y === y) {
        return true;
      }
      return false;
    },

    setMovable: function (move) {
      this.movable = move;
      if (this.movable) {
        this.div.style.cursor = "pointer";
      } else {
        this.div.style.cursor = "default";
      }
    },

    isColliding: function () {
      const other_obj = this.enviroment.items;
      var i;
      var listOfColl = [];
      for (i = 0; i < other_obj.length; i++) {
        if (other_obj[i].id !== this.id) {
          if (
            this.isClicked(
              other_obj[i].position.x,
              other_obj[i].position.y,
              other_obj[i].width,
              other_obj[i].height
            )
          ) {
            if (other_obj[i].displayItem) {
              listOfColl.push(other_obj[i]);
            }
          }
        }
      }
      return listOfColl;
    },

    isLandingOn: function () {
      const other_obj = this.enviroment.items;
      var i;
      var listOfColl = [];
      for (i = 0; i < other_obj.length; i++) {
        if (other_obj[i].id !== this.id) {
          if (
            this.position.x <= other_obj[i].position.x + other_obj[i].width &&
            this.position.x + this.width >= other_obj[i].position.x
          ) {
            if (this.position.y > other_obj[i].position.y) {
              if (other_obj[i].type === "solid" && other_obj[i].displayItem) {
                listOfColl.push(other_obj[i]);
              }
            }
          }
        }
      }
      if (listOfColl.length !== 0) {
        var biggest = listOfColl[0].height + listOfColl[0].position.y;
        for (i = 0; i < listOfColl.length; i++) {
          if (listOfColl[i].height + listOfColl[i].position.y > biggest) {
            biggest = listOfColl[i].height + listOfColl[i].position.y;
          }
        }
        return biggest;
      }
      return 0;
    },

    itemsAbove: function () {
      const other_obj = this.enviroment.items;
      var i;
      var listOfColl = [];
      for (i = 0; i < other_obj.length; i++) {
        if (other_obj[i].id !== this.id) {
          if (
            this.position.x <= other_obj[i].position.x + other_obj[i].width &&
            this.position.x + this.width >= other_obj[i].position.x
          ) {
            if (this.position.y < other_obj[i].position.y) {
              listOfColl.push(other_obj[i]);
            }
          }
        }
      }
      return listOfColl;
    },

    changeColor: function (r, g, b) {
      this.color = _getRGB(r, g, b);
      this.div.style.background = this.color;
    },

    changePosition: function (x, y) {
      this.position = { x: x, y: y };
      this.div.style.left = this.position.x + "px";
      this.div.style.bottom = this.position.y + "px";
    },

    logProperties: function () {
      var volume = this.width * this.height;
      var density = this.mass / volume;
      const message =
        "Color: " +
        this.color +
        ", Type: " +
        this.type +
        ", Position: {x: " +
        this.position.x +
        ", y: " +
        this.position.y +
        "}" +
        ", Mass: " +
        this.mass +
        ", Volume: " +
        volume +
        ", Density: " +
        density;
      console.log(message);
      return message;
    },

    showItem: function () {
      this.displayItem = true;
      this.enviroment.div.append(this.div);
    },

    setReactable: function (other, product) {
      this.reactions.push([other, product]);
      other.reactions.push([this, product]);
    },

    getProduct: function (other) {
      var i;
      for (i = 0; i < this.reactions.length; i++) {
        if (this.reactions[i][0].isSame(other)) {
          return this.reactions[i][1];
        }
      }
      return null;
    },

    duplicateMatter: function (x, y) {
      const newMatter = new Matter(
        this.enviroment,
        this.width,
        this.height,
        x,
        y,
        this.color,
        this.mass,
        this.movable,
        this.displayItem,
        this.name
      );
      if (this.type === "solid") {
        newMatter.createSolid();
      } else if (this.type === "liquid") {
        newMatter.createLiquid();
      } else if (this.type === "gas") {
        newMatter.createGas();
      }
      return newMatter;
    },

    isSame: function (other) {
      return this.name === other.name;
    },

    changeState: function (newState) {
      var oldState = this.type;
      this.type = newState;
      if (this.type === "liquid" || this.type === "gas") {
        this.movable = false;
      }
      if (this.type === "liquid") {
        if (oldState === "gas") {
          this.height = 50;
          this.width = 590;
        }
        this.liquidMove();
      }
      if (this.type === "gas") {
        this.height = 285;
        this.width = 590;
        this.gasMove();
      }
      if (this.type === "solid") {
        this.height = 50;
        this.height = 50;
        this.solidMove();
      }
      this.enviroment.applyGravityOnList([this]);
    },
  };

  global.Enviroment = global.Enviroment || Enviroment;
  global.Matter = global.Matter || Matter;
  global.EnviromentController =
    global.EnviromentController || EnviromentController;
})(window, window.document, $);
