// const wraperror = function wrapAsync(fn){
//     return function(req,res,next){
//         fn(req,res,next).catch(next);
//     }
// }
// module.exports = wraperror;

module.exports = (fn) => {
    return (req, res, next) => {
      fn(req, res, next).catch(next);
    };
  };

  // in code ko check karna 
  //lecture continue karo or mongo atlas pe account bano or database connect karo 
  //account bana ke lec.dekho