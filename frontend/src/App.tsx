import './App.css';
import {Button, Divider, Input, Modal, Space, Table, Tag} from "antd";
import {ColumnsType} from "antd/es/table";
import {main} from "../wailsjs/go/models";
import {useEffect, useState} from "react";
import {ApplicationAdd, ApplicationDelete, ApplicationList, ApplicationStart} from "../wailsjs/go/main/App";
import {CheckCircleOutlined, MinusCircleOutlined,} from '@ant-design/icons';
import Application = main.Application;

const emptyApp: Application = {
    id: 0,
    name: "",
    code: "",
    applicationPath: "",
    status: false
}


function App() {
    const [applicationList, setApplicationList] = useState<Application[]>([])
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [curApp, setCurApp] = useState<Application>(emptyApp);
    useEffect(() => {
        const doFetch = async () => {
            await fetchData()
            let timerId: any = null;
            const run = async () => {
                await fetchData()
                timerId = setTimeout(run, 3000);
            }
            await run()
            return () => {
                clearTimeout(timerId)
            }
        }
        doFetch()
            .then(f => {
                return f
            })
            .catch(console.error)
    }, [])

    const showModal = () => {
        setIsModalOpen(true);
    };

    const clearCurApp = () => {
        setCurApp(emptyApp)
    }

    const handleOk = async () => {
        await ApplicationAdd(curApp)
        setIsModalOpen(false)
        clearCurApp()
        await fetchData()
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        clearCurApp()
    };

    async function fetchData() {
        let data = await ApplicationList()
        setApplicationList(data)
    }

    const handleEdit = (app: Application) => {
        setCurApp({...app})
        setIsModalOpen(true);
    }

    const handleDelete = async (app: Application) => {
        await ApplicationDelete(app.id)
        setCurApp(emptyApp)
        setIsModalOpen(false);
        await fetchData()
    }

    const handleStart = async (app: Application) => {
        await ApplicationStart(app.applicationPath)
        await fetchData()
    }

    const columns: ColumnsType<main.Application> = [
        {
            title: 'id',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: '名称',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: '编码',
            dataIndex: 'code',
            key: 'code',
        },
        {
            title: '路径',
            dataIndex: 'applicationPath',
            key: 'applicationPath',
        },
        {
            title: '状态',
            key: 'status',
            render: (_, record) => {
                if (record.status) {
                    return <Tag icon={<CheckCircleOutlined/>} color="success">
                        run
                    </Tag>
                }
                return <Tag icon={<MinusCircleOutlined/>} color="default">
                    stop
                </Tag>
            }
        },
        {
            title: '操作',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    {record.status ? null :
                        <a onClick={() => handleStart(record)}>启动</a>
                    }
                    <a onClick={() => handleEdit(record)}>编辑</a>
                    <a onClick={() => handleDelete(record)}>删除</a>
                </Space>
            ),
        },
    ];


    return (
        <div id="App">
            <div style={{textAlign: "right", marginTop: "20px", marginRight: "10px"}}>
                <Button type="primary" onClick={() => showModal()}>添加</Button>
            </div>
            <Divider/>
            <Table columns={columns} dataSource={applicationList}/>
            <Modal title="新增/修改" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                <Input placeholder="name"
                       value={curApp.name}
                       onChange={e => setCurApp({
                           ...curApp,
                           name: e.target.value
                       })}/>
                <Input placeholder="code"
                       value={curApp.code}
                       onChange={e => setCurApp({
                           ...curApp,
                           code: e.target.value
                       })}/>
                <Input placeholder="path"
                       value={curApp.applicationPath}
                       onChange={e => setCurApp({
                           ...curApp,
                           applicationPath: e.target.value
                       })}/>
            </Modal>
        </div>
    )
}

export default App
