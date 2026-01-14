import React from 'react';

const btc_qr = process.env.PUBLIC_URL + '/images/btc_qr.png';
const eth_qr = process.env.PUBLIC_URL + '/images/eth_qr.png';

import Typography from '@material-ui/core/Typography';



// TipJars component displays various tip jars
const TipJars = () => {
    // returns the tip jars
    return (
        <>
            <h3 className="qQuotes">
                <i>
                    Venmo Tip Jar
                </i>
            </h3>
            <Typography className="rITipJarChars">
                <strong>
                    <i>
                        @Zack-Bielicki-1
                    </i>
                </strong>
            </Typography>
            <div className="rITipJars">
                <div className="m-sm-auto">
                    <h3 className="qQuotes">
                        <i>
                            BTC Tip Jar
                        </i>
                    </h3>
                    <Typography className="rITipJarChars">
                        <strong>
                            <i>
                                bc1q25mdmtjaxcenae7vjpnleec8m09ngcf7khwaw6
                            </i>
                        </strong>
                    </Typography>
                    <img
                        src={btc_qr}
                        width="300"
                        height="300"
                        className="d-inline-block rITipJar"
                        alt="{BTC QR}"
                    />
                </div>
                <br />
                <div className="m-sm-auto">
                    <h3 className="qQuotes">
                        <i>
                            ETH Tip Jar
                        </i>
                    </h3>
                    <Typography className="rITipJarChars">
                        <strong>
                            <i>
                                0x5EAAcaDFDbcF195d1E21c916FAC836fB94e86313
                            </i>
                        </strong>
                    </Typography>
                    <img
                        src={eth_qr}
                        width="300"
                        height="300"
                        className="d-inline-block mr-sm-1 rITipJar"
                        alt="{ETH QR}"
                    />
                </div>
            </div>
        </>
    );
};


export default TipJars;