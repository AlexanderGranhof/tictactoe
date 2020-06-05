import React, { FunctionComponent, CSSProperties } from "react";
import "./Table.scss";

interface TableProps {
    rowKeyIndex?: string,
    data: any[],
    style?: CSSProperties,
    className?: string,
    emptyComponent?: FunctionComponent
    rowClass?: (row: any, column: any) => string
    rowClick?: (row: any, column: any) => void
    sort?: (a:any, b:any) => number
    columns: {
        title: string,
        index: string,
        key?: string,
        render?: (row: any, column: any) => void
    }[]
}

const Table: FunctionComponent<TableProps> = props => {
    const columns = props.columns || [];
    let data = props.data || [];
    const { rowKeyIndex, rowClass, rowClick, sort } = props;
    const EmptyComponent = props.emptyComponent;

    if (typeof sort === "function") {
        data = data.sort(sort);
    }

    return (
        <table style={props.style} className={`table-component ${props.className ? props.className : ""}`}>
            <thead>
                <tr>
                    { columns.map((row, index) => {
                        return <th key={row.index}>{row.title}</th> 
                    }) }
                </tr>
            </thead>
            <tbody>
                {
                    data.length ? data.map((row: any) => (
                            <tr key={rowKeyIndex && row[rowKeyIndex]}>
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

                                        const rowKey = key === undefined ? rowKeyIndex ? row[rowKeyIndex] : rowIndex : row[key]

                                        return ( <td {...rowProps} key={rowKey}>{ value }</td> );
                                    })
                                }
                            </tr>
                        )
                    ) : EmptyComponent ? <tr><td><EmptyComponent /></td></tr> : null
                }
            </tbody>

        </table>
    )
};

export default Table