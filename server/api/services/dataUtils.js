module.exports = {
  iterateDataStructure: function iterateRecursive (data, predicateOrNameForProperty, actionOnProperty) {
    var scanObject = function (oneObject) {
      for (var field in oneObject) {
        if (Array.isArray(oneObject[field]) || typeof oneObject[field] == 'object') {   // array or object:  recursively iterate
          oneObject[field] = iterateRecursive(oneObject[field], predicateOrNameForProperty, actionOnProperty);
        } else {
          if (typeof predicateOrNameForProperty == 'function') {
            // a function that is executed to see if we should perform an action this property
            if (predicateOrNameForProperty(oneObject[field])) oneObject[field] = actionOnProperty(oneObject[field]);
          } else {
            // a string which is the name of the property on which to perform the action
            if (field == predicateOrNameForProperty) oneObject[field] = actionOnProperty(oneObject[field]);
          }
        }
      }
    };

    if (Array.isArray(data)) {
      for (var i = 0; i < data.length; i++) {
        scanObject(data[i]);
      }
    } else {
      scanObject(data);
    }

    return data;
  }
};
