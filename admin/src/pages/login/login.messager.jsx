import { toast } from 'react-toastify'

export const retrieveErrorMessage = (error) => {
	if (error.message) {
		if (error.message === 'VALIDATION_FAILED') {
			if (error.errors && error.errors.length > 0) {
				error.errors.map(err => toast.error(err.error))
			}
		} else {
			toast.error(error.message, {
				position: 'top-right',
				autoClose: 3000,
			})
		}
	}
}