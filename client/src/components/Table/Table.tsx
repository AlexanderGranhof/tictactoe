import React, { FunctionComponent } from "react";

interface TableProps {
    data: [{}],
    columns: [
        {
            title: String,
            index: String,
            key?: string,
            render?: (row: any) => void
        }
    ]
}

const Table: FunctionComponent<TableProps> = props => {
    const columns = props.columns || [];
    const data = props.data || [];

    return (
        <table>
            <tr>
                { columns.map(row =>  <th>{row.title}</th> ) }
            </tr>
            <tbody>
                {
                    data.map(row => (
                        <tr>
                            {
                                columns.map(({ key, index, render }) => { 
                                    const renderMethod = typeof render === "function" ? render : false;
                                    const dataIndex = typeof index === "undefined" ? index : false;

                                    if (renderMethod === false && dataIndex === false) {
                                        console.warn("index is", index);
                                        console.warn("render is", render);

                                        throw new Error(`column is missing index or render method`);
                                    }

                                    let value: any = "";

                                    if (renderMethod) {
                                        value = renderMethod(row)
                                    } else if (dataIndex) {
                                        value = row[dataIndex]
                                    }

                                    return ( <td key={key}>{ value }</td> );
                                })
                            }
                        </tr>
                        )
                    )
                }
            </tbody>

        </table>
    )
};

export default Table