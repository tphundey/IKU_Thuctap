import  { useState, useEffect } from 'react';
import axios from 'axios';
import { Line } from '@ant-design/charts';
import { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons';
import { Card, Col, Row, Statistic } from 'antd';

const Dashboard = () => {
    const [googleAccountCount, setGoogleAccountCount] = useState(0);
    const [data, setData] = useState([]);
    const [productCount, setProductCount] = useState(0);
  
    useEffect(() => {
        axios
          .get('http://localhost:3000/hoadon')
          .then((response) => {
            const chartData = response.data.map((order:any) => ({
              date: order.date,
              value: order.totalPrice,
            }));  
            chartData.sort((a:any, b:any) => new Date(b.date) - new Date(a.date));
            setData(chartData);
          })
          .catch((error) => {
            console.error('Error fetching data:', error);
          });
      }, []);
      
    useEffect(() => {
        // Gọi API để lấy danh sách sản phẩm
        axios.get('http://localhost:3000/products')
            .then((response) => {
                // Đặt số lượng sản phẩm dựa trên dữ liệu trả về
                setProductCount(response.data.length);
            })
            .catch((error) => {
                console.error('Error fetching product data:', error);
            });
    }, []); // Mảng phụ thuộc rỗng để chạy useEffect này một lần khi component được mount
    useEffect(() => {
        // Gọi API để lấy danh sách tài khoản Google
        axios.get('http://localhost:3000/categories')
            .then((response) => {
                // Đặt số lượng tài khoản Google dựa trên dữ liệu trả về
                setGoogleAccountCount(response.data.length);
            })
            .catch((error) => {
                console.error('Error fetching Google account data:', error);
            });
    }, []); // Mảng phụ thuộc rỗng để chỉ chạy useEffect này một lần khi component được mount
    const config = {
        data,
        height: 400,
        xField: 'date', // Đổi từ 'year' sang 'date'
        yField: 'value',
        point: {
            size: 5,
            shape: 'diamond',
        },
        tooltip: {
            showCrosshairs: true, // Hiển thị đường kẻ chéo khi di chuột qua điểm
            shared: true,
        },
    };
    return (
        <div>
            <Row gutter={16}>
                <Col span={12}>
                    <Card bordered={false} >
                        <Statistic
                            title="Tống sản phẩm"
                            value={productCount}
                            precision={2}
                            valueStyle={{ color: '#3f8600' }}
                            prefix={<ArrowUpOutlined />}
                            suffix="%"
                        />
                    </Card>
                </Col>
                <Col span={12}>
                    <Card bordered={false}>
                        <Statistic
                            title="Tổng danh mục"
                            value={googleAccountCount}
                            precision={2}
                            valueStyle={{ color: '#cf1322' }}
                            prefix={<ArrowDownOutlined />}
                            suffix="%"
                        />
                    </Card>
                </Col>
            </Row>
            <br />
            <h1>Thống kê doanh thu</h1>
            <br />
            <Line {...config} />
        </div>
    );
};

export default Dashboard;
