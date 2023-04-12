import MultiChainLogin from '@/components/MultiChainLogin'

export default function Login() {
  return (
    <div
      style={{
        display: 'flex',
        height: '70vh',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <MultiChainLogin />
    </div>
  )
}
