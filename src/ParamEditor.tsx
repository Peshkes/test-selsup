import React, {useState} from "react";

interface Param {
    id: number;
    name: string;
    type: "string";
}

interface ParamValue {
    paramId: number;
    value: string;
}

interface Color {
    id: number;
    name: string;
}

interface Model {
    paramValues: ParamValue[];
    colors: Color[];
}

interface Props {
    params: Param[];
    model: Model;
}

const ParamEditor: React.FC<Props> = ({params, model}) => {
    const [paramValues, setParamValues] = useState<ParamValue[]>(() =>
        syncParamValues(params, model.paramValues)
    );
    const [output, setOutput] = useState<Model | null>(null);

    function syncParamValues(params: Param[], paramValues: ParamValue[]): ParamValue[] {
        return params.map((param) => {
            const existingValue = paramValues.find((value) => value.paramId === param.id);
            return {
                paramId: param.id,
                value: existingValue ? existingValue.value : "",
            };
        });
    }

    const updateParamValue = (paramId: number, value: string) => {
        setParamValues((prevValues) =>
            prevValues.map((paramValue) =>
                paramValue.paramId === paramId ? {...paramValue, value} : paramValue
            )
        );
    };

    const getModel = (): Model => ({paramValues, colors: model.colors});

    const saveModel = () => {
        setOutput(getModel());
    };

    return (
        <div style={{display: "flex", gap: "40px"}}>
            <div style={{flex: "1"}}>
                <h2>Редактор параметров</h2>
                <form>
                    {params.map((param) => {
                        const paramValue = paramValues.find((value) => value.paramId === param.id);
                        return (
                            <div key={param.id} style={{marginBottom: "10px"}}>
                                <label style={{display: "block", marginBottom: "5px"}}>
                                    {param.name}:
                                </label>
                                <input
                                    type="text"
                                    value={paramValue?.value || ""}
                                    onChange={(e) => updateParamValue(param.id, e.target.value)}
                                    style={{width: "100%", padding: "5px", fontSize: "14px"}}
                                />
                            </div>
                        );
                    })}
                </form>
                <button
                    onClick={saveModel}
                    style={{
                        marginTop: "20px",
                        padding: "10px",
                        backgroundColor: "#007bff",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                    }}
                >
                    Сохранить
                </button>
            </div>
            <div
                style={{
                    width: "500px",
                    flex: "1",
                    border: "1px solid #ddd",
                    borderRadius: "15px",
                    padding: "20px",
                    backgroundColor: "#272626",
                    overflowWrap: "break-word",
                }}
            >
                <h3>Результат:</h3>
                {output ? (
                    <pre style={{whiteSpace: "pre-wrap", wordWrap: "break-word", textAlign: "left"}}>
                        {JSON.stringify(output, null, 2)}
                    </pre>
                ) : (
                    <p>Нажмите "Сохранить", чтобы увидеть результат.</p>
                )}
            </div>
        </div>
    );
};

export default ParamEditor;
