import React, { FunctionComponent, CSSProperties } from "react";
import { CSSTransition } from "react-transition-group";
import "./Table.scss";

interface TableProps {
    keyIndex?: string,
    data: any[],
    style?: CSSProperties
    rowClass?: (row: any, column: any) => void
    rowClick?: (row: any, column: any) => void
    columns: [
        {
            title: string,
            index: string,
            key?: string,
            render?: (row: any, column: any) => void
        }
    ]
}

const Table: FunctionComponent<TableProps> = props => {
    const columns = props.columns || [];
    const data = props.data || [];
    const { keyIndex, rowClass, rowClick } = props;

    return (
        <table style={props.style} className="table-component">
            <thead>
                <tr key={123}>
                    { columns.map((row, index) => {
                        return <th key={row.index}>{row.title}</th> 
                    }) }
                </tr>
            </thead>
            <tbody>
                {
                    data.map((row: any) => (
                            <tr key={keyIndex && row[keyIndex]}>
                                {
                                    columns.map((column, rowIndex) => {
                                        const { key, index, render } = column;
                                        const renderMethod = typeof render === "function" ? render : false;
                                        const dataIndex = typeof index !== "undefined" ? index : false;

                                        if (renderMethod === false && dataIndex === false) {
                                            console.warn("index is", index);
                                            console.warn("render is", render);

                                            throw new Error(`column is missing index or render method`);
                                        }

                                        let value: any = "";
                                        let rowProps: any = {};

                                        if (renderMethod) {
                                            value = renderMethod(row, column)
                                        } else if (dataIndex) {
                                            value = row[dataIndex]
                                        }

                                        if (typeof rowClass === "function") {
                                            rowProps.className = rowClass(row, column)
                                        }

                                        if (typeof rowClick === "function") {
                                            rowProps.onClick = () => rowClick(row, column)
                                        }

                                        const rowKey = keyIndex ? row[keyIndex] : key === undefined ? rowIndex : row[key]

                                        return ( <td {...rowProps} key={rowKey}>{ value }</td> );
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