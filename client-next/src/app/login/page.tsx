import AuthForm from './components/login-form'

function Login() {
	return (
		<div className='flex h-screen w-screen items-center justify-center bg-gray-200'>
			<div className='z-10 w-full max-w-md overflow-hidden rounded-2xl border border-gray-100 shadow-xl'>
				<div className='flex flex-col items-center justify-center space-y-3 border-b border-gray-200 bg-white px-4 py-6 pt-8 text-center sm:px-16'>
					<h3 className='text-xl font-semibold'>Sign In</h3>
					<p className='text-sm text-gray-500'>
						Use your email and password to sign in
					</p>
				</div>
				<AuthForm isLogin />
			</div>
		</div>
	)
}

export default Login
