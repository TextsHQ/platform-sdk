import { QRCodeSVG } from 'qrcode.react'

const size = 256

const QRCode: React.FC<{ value: string | undefined }> = ({ value }) => ((
  <div style={{ background: 'white', width: size, height: size, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: 'auto' }}>
    {value
      ? <QRCodeSVG includeMargin value={value} size={size} />
      : <div style={{ color: 'black', fontSize: '1.5em' }}>Loading...</div>}
  </div>
))

export default QRCode
