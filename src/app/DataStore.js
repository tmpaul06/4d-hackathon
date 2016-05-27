import Tree from "drawings/Tree";

class DataStore {

  constructor() {
    this.cache = {
      T: 0,
      global: {
        WIDTH: 600,
        HEIGHT: 400
      },
      page2: {
        products: [ {
          name: "Canon EOS 1200D",
          imageSrc: "canon",
          description: "Canon, which is one of the global leaders in the world of photography, has been creating cameras with diverse models. This time, Canon has come up with an 18 Mega pixel Digital SLR camera for all you people, who love capturing moments every now and then. With the advent of this particular product, Canon has made DSLR photography possible for everybody. This latest model by Canon host multiple user-friendly features and creative filters through which it would be easier for DSLR users to click attractive images with sharper details and gorgeous background blur. Canon EOS 1200D 18MP Digital SLR Camera with 18-55mm and 55-250 mm IS Lens is easy to use and it delivers results that you will love for sure."
        }, {
          name: "Moto G Plus, 4th Gen",
          imageSrc: "motog",
          description: "Great pictures make all the difference. That’s why there’s the new Moto G Plus, 4th Gen. It gives you a 16 MP camera with laser focus and a whole lot more, so you can say goodbye to blurry photos and missed shots. Instantly unlock your phone using your unique fingerprint as a passcode. Get up to 6 hours of power in just 15 minutes of charging, along with an all-day battery. And get the speed you need now and in the future with a powerful octa-core processor."
        }, {
          name: "Ruosh Brown Shoes",
          description: "Look classy and smart by wearing these formal shoes for men from RUOSH. These shoes have a leather upper and a TPR (thermoplastic polyurethane) sole that keeps your feet comfortable. You can team these shoes with formals of your choice to look stylish.",
          imageSrc: "shoes"
        }, {
          name: "Reebook Bts June Backpack",
          description: "If you’re a backpack person then this black coloured backpack from Reebok is the perfect pick for you. Made from polyester, this backpack will last a long time. Featuring a stylish and capacious design, this backpack will store all your essentials effectively.",
          imageSrc: "rebook_bag"
        } ],
        productFeatures: [ {
          name: "Best-in-class camera",
          imageSrc: "motog_camera",
          description: "Everyone deserves great photos. That’s why the Moto G Plus, 4th Gen has the most advanced 16 MP camera in its class. It gives you two additional auto-focus technologies that work quickly so you never miss the shot, resulting in sharp, clear pictures both day and night. It has built-in hardware to improve brightness in low-light settings. It includes exclusive camera software that makes sure you get the best shot. And since it’s a 16 MP camera, it captures every moment in beautiful detail, just as you remember. The Moto G Plus, 4th Gen comes with OmniVision PureCel optical sensor technology that delivers great performance - boost low light capability and better color noise performance, with ultra-low power consumption."
        }, {
          name: "Quick Capture & Best Shot",
          description: "Launch the rear camera with two twists of your wrist, then double twist again to switch to the front camera. So no matter if you’re capturing a once in a lifetime moment or just a fun selfie with friends, you always get the picture. Best Shot: You don’t have to be a professional to get a great picture. The camera captures multiple shots before and after you touch the screen. It analyses the images recognising issues like blurred subjects or blinking eyes, before recommending the best picture to keep, so you will get great results.",
          imageSrc: "motog_quick_capture"
        }, {
          name: "Great group shots. Smile, everyone",
          description: "The front camera captures a 84 degree wide angle, so it’s easy to get everyone in the picture. And since it’s a high-resolution 5 MP camera, both selfies and group shots look their best.",
          imageSrc: "motog_great_shots"
        } ]
      },
      page1: {
        trees: [ {
          x: 0,
          y: 0 
        }, 
        {
          x: 1,
          y: 0 
        },
        {
          x: 2,
          y: 0 
        }, {
          x: 3,
          y: 0
        } ]
      }
    };
    this.callback = function() {};
  }

  get(path = []) {
    let data = this.cache;
    if (typeof path === "string") {
      path = path.split(".");
    }
    for(let i = 0, len = path.length; i < len; i++) {
      if (data[path[i]] !== undefined) {
        data = data[path[i]];
      } else {
        data = undefined;
        break;
      }
    }
    return data;
  }

  recursiveSet(data, path, value) {
    let key = path[0];
    if (path.length === 1) {
      data[key] = value;
      return data;
    }
    if (data[key] !== undefined) {
      let result = this.recursiveSet(data[key], path.slice(1), value);
      data[key] = result;
    } else {
      return data;
    }
    return data;
  }

  set(path = [], value) {
    this.cache = this.recursiveSet(this.cache, path, value);
    this.callback();
    // let data = this.cache;
    // let len = path.length;
    // let cacheFragments = [];
    // for(let i = 0; i < len; i++) {
    //   if (i === len - 1) {
    //     // Work backwards
    //     if (data) {
    //       data[path[len - 1]] = value;
    //       // for (let j = cacheFragments.length - 1; j > 0; j--) {
                 
    //       // }
    //     }
    //     break;
    //   }
    //   let key = path[i];
    //   if (data[key] !== undefined) {
    //     cacheFragments.push(data);
    //     data = data[key];
    //   } else {
    //     data = undefined;
    //     break;
    //   }
    // }
    // if (data) {
    //   data[path[len - 1]] = value;
    //   this.callback();
    // }
  }
};

export default new DataStore();