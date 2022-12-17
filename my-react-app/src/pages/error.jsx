const Error = () => { 
    <>
    <div
            className='p-5 text-center bg-image'
            style={{ backgroundImage: "url('https://img.freepik.com/free-vector/cinema-open-neon-sign_1262-15882.jpg?w=1380&t=st=1671272486~exp=1671273086~hmac=0b6812aa897b6fda9c355a881667e89df08b25342000ddfd4554d5fb77f11bc1')", height: 400 }}
        >
            <div className='mask custom-inner' style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)' }}>
                <div className='d-flex justify-content-center align-items-center h-100'>
                    <div className='text-white'>
                        <h1 className='mb-3'>404 Page not found</h1>
                        <h4 className='mb-3'>Opps, looks like we couldn't find the page you were looking for</h4>
                       
                    </div>
                </div>
            </div>
        </div>
    </>
};

export default Error;