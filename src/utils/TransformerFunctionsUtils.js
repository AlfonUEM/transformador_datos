
const functionCodePreface = "function transform(input, parameters){";
const functionCodePrefacePattern = /^function transform\(input, parameters\)\{/g
const functionCodeEnd = "}"
const functionCodeEndPattern = /}$/g


function extractInputParameters(funcParameters){
    let inputParameters = {};
    for (const [paramName, paramDefinition] of Object.entries(funcParameters)) {
        inputParameters[paramName] = paramDefinition["value"];
    }
    return inputParameters;
}

export function getTestInput(inputCode){
    let errorReturned = null;
    let output = null;
    let extendedInputCode = inputCode + "; return input;";
    try {
        let func = new Function(extendedInputCode);
        output = func();
    } catch (error) {
        errorReturned = error.stack;
    }
    console.log(errorReturned)
    return [errorReturned, output]
}

function runTransformerFunction(input, funcParameters, functionCode){
    let errorReturned = null;
    let output = null;
    let srcToEval = "";
    srcToEval = functionCode.replace(functionCodePrefacePattern, "");
    srcToEval = srcToEval.replace(functionCodeEndPattern, "");
    try {
        let func = new Function("input", "parameters", srcToEval);
        output = func(input, extractInputParameters(funcParameters));
    } catch (error) {
        errorReturned = error.stack;
    }
    return [errorReturned, output]

}

export default runTransformerFunction;