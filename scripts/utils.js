/**
 * This function groups an array of objects by a specified key and stores the values of another key in the grouped arrays.
 *
 * @param {Array} array - The input array of objects to be grouped.
 * @param {string} groupKey - The key to group the array by.
 * @param {string} valueKey - The key whose values are to be stored in the grouped arrays.
 * @returns {Object} - The output object with properties named after the groupKey values and values being arrays of valueKey values.
 */
function groupBy(array, groupKey, valueKey) {
    return array.reduce((result, item) => {
        let key = item[groupKey];
        let value = item[valueKey];
        if (!result[key]) {
            result[key] = [];
        }
        result[key].push(value);
        return result;
    }, {});
}

/**
 * This function calculates the mean (average) of an array of numbers.
 *
 * @param {Array} array - The input array of numbers.
 * @returns {number} - The mean of the input array.
 */
function mean(array) {
    return array.reduce((a, b) => a + b) / array.length;
}

/**
 * This function calculates the mean of each array in the input object.
 * It assumes that each property of the object is an array of numbers.
 * 
 * @param {Object} object - The input object. Each property should be an array of numbers.
 * @returns {Object} The output object. Each property will be the mean of the corresponding property in the input object.
 */
function calculateMeanOfObjectArrays(object) {
    // For each key in the object
    Object.keys(object).forEach(key => {
        // Calculate the mean of the array at object[key]
        object[key] = mean(object[key]);
    });

    // Return the modified object
    return object;
}

/**
 * This function sorts the properties of an input object based on their keys.
 * It creates a new object and assigns the properties in the sorted order of the keys.
 * 
 * @param {Object} obj - The input object whose properties are to be sorted.
 * @returns {Object} sortedObj - The output object with properties in the sorted order of the keys.
 */
function sortObjectPropertiesByKey(obj) {
    // Get the keys and sort them
    let keys = Object.keys(obj).sort();

    // Create a new object and assign the properties in the sorted order
    let sortedObj = {};
    for (let key of keys) {
        sortedObj[key] = obj[key];
    }

    // Return the sorted object
    return sortedObj;
}

/**
 * This function renames specific indicator properties of an object using the modifyObjectProperty function.
 *
 * @param {Object} obj - The object whose properties are to be renamed.
 */
function renameIndicatorProperties(obj) {
    // Rename specific properties of the object
    modifyObjectProperty(obj,"D1_1","Centrarse en los desafíos");
    modifyObjectProperty(obj,"D1_2","Descubrir necesidades");
    modifyObjectProperty(obj,"D1_3","Analizar el contexto");
    modifyObjectProperty(obj,"D1_4","Identificar, crear y aprovechar oportunidades");
    modifyObjectProperty(obj,"D2_1","Imaginar");
    modifyObjectProperty(obj,"D3_1","Definir problemas");
    modifyObjectProperty(obj,"D3_2","Ser curioso/a y abierto/a");
    modifyObjectProperty(obj,"D3_3","Ser innovador/a");
    modifyObjectProperty(obj,"D3_4","Desarrollar ideas");
    modifyObjectProperty(obj,"D3_5","Diseñar valor");
}

/**
 * This function removes the property with key "undefined" from the input object,
 * then renames specific properties using the renameIndicatorProperties function,
 * and finally sorts the remaining properties based on their keys.
 * 
 * @param {Object} obj - The input object to be cleared, renamed, and sorted.
 * @returns {Object} - The output object with the "undefined" property removed, specific properties renamed, and remaining properties sorted by keys.
 */
function cleanAndOrganizeProperties(obj) {
    // Remove the property with key "undefined"
    delete obj["undefined"];

    // Rename specific properties of the object
    renameIndicatorProperties(obj);

    return obj; 
}

/**
 * This function modifies a property of an object. If the old property does not exist,
 * it creates a new property with the new name and assigns it a default value of [0].
 *
 * @param {Object} obj - The object whose property is to be modified.
 * @param {string} oldName - The current name of the property.
 * @param {string} newName - The new name for the property.
 */
function modifyObjectProperty(obj, oldName, newName) {
    // Check if the old property name is different from the new property name
    if (oldName !== newName) {
        // Check if the object has a property with the old name
        if (obj.hasOwnProperty(oldName)) {
            // Define a new property on the object with the new name
            // and the same descriptor as the old property
            Object.defineProperty(obj, newName,
                Object.getOwnPropertyDescriptor(obj, oldName));
            // Delete the old property from the object
            delete obj[oldName];
        } else {
            // If the old property does not exist on the object,
            // create a new property with the new name and assign it a default value of [0]
            obj[newName] = [0];
            // Log a warning to the console
            console.warn(`Property ${oldName} does not exist on the object.`);
        }
    }
}

/**
 * This function groups the input array by a specified key, calculates the mean of the grouped arrays,
 * removes the property with key "undefined", and then sorts the remaining properties based on their keys.
 * 
 * @param {Array} array - The input array to be grouped and processed.
 * @param {string} groupKey - The key to group the array by.
 * @param {string} valueKey - The key to calculate the mean of in each group.
 * @returns {Object} - The output object with the "undefined" property removed and remaining properties sorted by keys.
 */
function groupCalculateMeanAndSort(array, groupKey, valueKey) {
    // Group the input array by the specified key and calculate the mean of the grouped arrays
    var groupedArray = calculateMeanOfObjectArrays(groupBy(array, groupKey, valueKey));

    // Remove the property with key "undefined" from the grouped array,
    // then sort the remaining properties based on their keys
    return cleanAndOrganizeProperties(groupedArray);
}