import './App.css';
import {Button, Divider, Space, Table, Tag} from "antd";
import {ColumnsType} from "antd/es/table";
import {main} from "../wailsjs/go/models";
import {useEffect, useState} from "react";
import Application = main.Application;
import {ApplicationList, ApplicationAdd} from "../wailsjs/go/main/App";

function App() {
    const [applicationList, setApplicationList] = useState<Application[]>([])

    useEffect(() => {
        fetchData().catch(console.error);
    }, [])

    async function fetchData(){
        let data =  await ApplicationList()
        setApplicationList(data)
    }
    async function handleAdd() {
        let app = {
           name: "test",
           code: "testCode",
            applicationPath: "testPath"
        }
        await ApplicationAdd(app)
        await fetchData()
    }

    const columns: ColumnsType<main.Application> = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Code',
            dataIndex: 'code',
            key: 'code',
        },
        {
            title: 'Path',
            dataIndex: 'applicationPath',
            key: 'applicationPath',
        }
    ];

    return (
        <div id="App">
            <Space>
                <Button type="primary" onClick={() => handleAdd()}>添加</Button>
            </Space>
            <Divider />
            <Table columns={columns} dataSource={applicationList} />
        </div>
    )
}

export default App
