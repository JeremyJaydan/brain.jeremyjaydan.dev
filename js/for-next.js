/**
* @author JeremyJaydan <jeremy@parmenter.io>
* @license MIT
* @desc Simple iteration script
*/
const $for = async (target, callback = () => {}, options = {}) => {
  if(target){

    return new Promise((resolve, reject) => {
      let iterator = target;
      if(typeof target === "number") iterator = new Array(target).fill().map((a, i) => (i + 1));
      if(target.constructor === Object) iterator = Object.entries(target);

      const length = iterator.length;

      const {
        interval = 0
      } = options;

      const values = [];
      const every = (items, index, ctx = {}) => {

        const done = index === length - 1;

        const stop = (options = {}) => {
          const { value = null } = options;
          values.push(value);
          resolve(values);
        };

        let next = (options = {}) => {

          const {
            skip = false,
            value = null
          } = options;

          if(skip){
            index += skip;
            next = () => {};
          }
          values.push(value);

          if(!done){
            if(!interval){
              every(items, index + 1, skip && ctx || {});
            }else{
              setTimeout(every, interval, items, index + 1, skip && ctx || {});
            }
          }else{
            resolve(values);
          }
        };

        callback(items[index], {index, next, stop, values, ctx});
      };

      every(iterator, 0);
    });

  }
};