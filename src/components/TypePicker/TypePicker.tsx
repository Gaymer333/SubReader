// See App.js (or run program) to read the introduction.

import React, { useEffect, useState } from 'react'

// Enum over the diffrent types.
enum Types {
    s = 's',
    n = 'n',
    a = 'a',
    o = 'o',
}

// A string, is maybe not of the "Types", so in that cause, we need to return an defualt.
const GetTypeOrDefault = (string: string): Types => Object.values(Types).find(t => t === string) || Types.s

// Interface to help keep order in the recursive data
interface TypePickerElement {
    name: string,
    type: Types,
    children: Array<TypePickerElement>
}

// We need a new TypePickerElement object several places. Best to make a clone function.
// "CUO"
const NewDefaultTypePickerElement = () => {
    return {...{
        name: '',
        type: Types.s,
        children: []
    }}
}

// Starting point for the code. This is the only funtion that is exported.
const TypePickerWrapper = () => {

    const [product, setProduct] = useState<TypePickerElement>(NewDefaultTypePickerElement())

    // We could move this down into the "<TypePicker ... />" directly.
    // But i feel this is eaiser to read.
    const renderString = (result: TypePickerElement) => setProduct(result);

    return <div className="TypePickerMainWrapper" >
        <div>
            <h1>Typescript type generator</h1>
            <TypePicker updateParent={renderString} element={product} />
        </div>
        <div>
            <TypePickerRender product={product} />
        </div>
    </div>
}

// When we need to reander, this function will be the render root element.
const TypePickerRender = (props: {
    product: TypePickerElement
}) => {
    let string = "type " + TypePickerElementToString(props.product)

    return <pre>{string}</pre>
}

// This could have been made even shorter:
// ...}) => <pre>{"type " + TypePickerElementToString(props.product)}</pre>

// When we need to convert it to code syntax, we need to hange every element.
const TypePickerElementToString = (element: TypePickerElement, lastChild: boolean = true, childLevel: number = 0): string => {
    let r: string = "";
    // With this, we can reuse the same function for both the root and under diclrastions
    const setterChar = childLevel === 0 ? " =" : ":"

    // An feature that was not in your code.
    // I feeled that this made it eaiser to see where we have forgotten name of the variable.
    r += element.name ? element.name : "[NAME MISSING]"

    r += setterChar + " " + TypePickerElementTypeToString(element, childLevel);

    if (!lastChild) r += ",";

    return r
}

// The type to stirng converter logic is seperated, cause Array needs the informations without name.
const TypePickerElementTypeToString = (element: TypePickerElement, childLevel: number): string => {
    let r: string = "";

    switch (element.type) {
        // Not logic neede for string
        case Types.s:
            r += "string"
        break;
        
        // Not logic neede for number
        case Types.n:
            r += "number"
        break;
        
        // Array is unik, cause it can never have more the one child.
        case Types.a:
            const arrayElement = element.children[0];
            // It should not happen. But can we end up with a element without childen? In that case we need to fall back on a defualt
            // "CUO"
            const typeAsString: string = arrayElement ? TypePickerElementTypeToString(arrayElement, childLevel + 1) : Types.s;
            r += "Array<" + typeAsString + ">"
        break;
        
        // Object need always to work as an many child element. Even if it have one or none.
        case Types.o:
            // Set strings that need to be used more time.
            // Prefix will grow the longer down in the data tree we get.
            // Should there be a way to set the amount of spaces?
            const prefix: string = "  ".repeat(childLevel)
            const newLineChar: string = "\n"

            r += "{" + newLineChar
            element.children.forEach((child, index) => {
                if(index) r += newLineChar
                r += prefix + "  " + TypePickerElementToString(child, index + 1 === element.children.length, childLevel + 1)
            });
            r += newLineChar + prefix + "}"
        break;
    }

    return r
}

// The TypePicker it self.
const TypePicker = (props: {
    updateParent: (result: TypePickerElement, index?: null) => void,
    element: TypePickerElement,
    parentIsArray?: boolean,
}) => {

    // Here we use useState to make sure that the rerender works. But we work with recursive functions, so...
    const [localElement, setLocalElement] = useState<TypePickerElement>(props.element)

    // ... we need to make sure that the parent always are up-to-date, and...
    useEffect(() => {
        props.updateParent(localElement);
    }, [localElement])

    // ... since the parent can delete it's children, the order that children come in can change.
    // But a god and bad part of React, is that is will just reuse the <option /> tags.
    // So we need to update the child manuraly, if a previres sibline have been removed.
    useEffect(() => {
        if (props.element.name !== localElement.name || props.element.type !== localElement.type) {
            setLocalElement(props.element)
        }
    }, [props.element])

    // We need handler to handle the changes. Name is string to string. No big deal.
    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLocalElement({ ...localElement, name: e.target.value })
    }

    // From here, I start to make clone everytime i need to make changes to the "localElement."
    // This is maybe more heavy on the clint then needed.
    // But it insures that we do not have any State data problems.

    // But when the selecter change, do we need to look at the array.
    const handleSelectChange = (e: React.ChangeEvent<{ value: unknown }>) => {
        const newElement = { ...localElement, type: GetTypeOrDefault(e.target.value as string) }

        // If we have an array, we need to eacher:
        if (newElement.type === Types.a) {
            if (!newElement.children.length) {
                // Add an child, if there is non
                newElement.children.push(NewDefaultTypePickerElement())
            } else if(newElement.children.length > 1) {
                // Or remove down to 1, if there is more then 1.
                newElement.children.splice(1)
                newElement.children[0].name = ""
            }
        }
        // Object is eaiser. Just need an child, if it have none.
        else if (newElement.type === Types.o && !newElement.children.length) newElement.children.push(NewDefaultTypePickerElement())

        setLocalElement(newElement)
    }

    // Sometimes do our child change on there own.
    // In that case, do we need to send that information up in the recursive tree,
    // so the root function can update the render.
    const handleChildChange = (element: TypePickerElement, index: number) => {
        const newElement = { ...localElement }
        newElement.children[index] = element;
        setLocalElement(newElement)
    }

    // Add a child. With the default element code, is this easy.
    const handleAddChild = () => {
        const newElement = { ...localElement }
        newElement.children.push(NewDefaultTypePickerElement())
        setLocalElement(newElement)
    }

    // Remove a child. Again easy.
    const handleRemoveChild = (index: number) => {
        const newElement = { ...localElement }
        newElement.children.splice(index, 1);
        setLocalElement(newElement)
    }
    // A good thing to note, is that the "useEffect" further up handles all the recursive update logic.

    return <>
        <div className="TypePickerWrapper">
            <div className="TypePicker">
                <p className="NameLabel Label">Name:</p>
                <input value={localElement.name} disabled={props.parentIsArray} onChange={handleNameChange} />
                <p className="TypeLabel Label">Type:</p>
                <select value={localElement.type} onChange={handleSelectChange}>
                    <option value={Types.s}>String</option>
                    <option value={Types.n}>Number</option>
                    <option value={Types.a}>Array</option>
                    <option value={Types.o}>Object</option>
                </select>
            </div>
            {/* This is a little messy. Could maybe be streamedlined. But it works. */}
            {/* "CUO" */}
            { (localElement.type === Types.o || localElement.type === Types.a) &&
                <div className="TypePickerChildren">
                    {localElement.children.map((child, index) => 
                        <div className="TypeElementArray" key={index}>
                            <TypePicker parentIsArray={localElement.type === Types.a} updateParent={(element: TypePickerElement) => handleChildChange(element, index)} element={child} />
                            {localElement.type === Types.o &&
                                <button onClick={() => handleRemoveChild(index)}>-</button>
                            }
                        </div>
                    )}
                    {localElement.type === Types.o &&
                        <button onClick={handleAddChild} className="AddTypePicker">+</button>
                    }
                </div>
            }
        </div>
    </>
}

// And the exporter
export default TypePickerWrapper