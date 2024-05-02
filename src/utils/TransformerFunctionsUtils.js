
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

function runTransformerFunction(input, funcParameters, functionCode){
    let errorReturned = null;
    let output = null;
    let srcToEval = "";
    srcToEval = functionCode.replace(functionCodePrefacePattern, "");
    srcToEval = srcToEval.replace(functionCodeEndPattern, "");
    let func = new Function("input", "parameters", srcToEval);
    output = func(input, extractInputParameters(funcParameters));
    console.log(output);
    return [errorReturned, output]

}

export default runTransformerFunction;