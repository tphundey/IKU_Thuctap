import './footer.css'

const Footer = () => {
    return (
        <div className='responsive-div'>
            <footer>
                <div className="container">
                    <div className="row">
                        <div className="col">
                            <ul>
                                <li className='footer-light'>Tất cả sản phẩm</li>
                                <li>Sách y được</li>
                                <li>Truyện tranh</li>
                                <li>Sách văn học</li>
                            </ul>
                        </div>
                        <div className="col">
                            <ul>
                                <li className='footer-light'>Chính sách mua hàng</li>
                                <li>Hình thức thanh toán</li>
                                <li>Chính sách giao hàng</li>
                                <li>Chính sách bảo hành</li>
                            </ul>
                        </div>
                        <div className="col">
                            <ul>
                                <li className='footer-light'>Thông tin liên hệ</li>
                                <li>Điện thoại: 1900 0359</li>
                                <li>Email: marketing@bookstore.com</li>
                                <li>Website: bookstore.com</li>
                                <li>
                                    <div className="icon"></div>
                                    <div className="icon"></div>
                                    <div className="icon"></div>
                                    <div className="icon"></div>
                                </li>
                            </ul>
                        </div>
                        <div className="col">
                            <ul>
                                <li className='footer-light'>Về BookStore</li>
                                <li>Mã số thuế: 0108195925</li>
                                <li>
                                    <div className="img_logo">
                                        <img src="../../../public/img/logoSaleNoti.png" alt="" />
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <hr />

                    <br />
                </div>
            </footer>
        </div>
    )
}

export default Footer