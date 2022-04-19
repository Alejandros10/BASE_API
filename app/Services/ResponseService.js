'use-stric';

const GetHeaderLang = use('App/Services/GetHeaderLang');

class ResponseService {
	transactionResponse(result, request, type = null) {
		let success = 'messages.registered';
		let error = 'messages.noStored';
		switch (type) {
			case 'u':
				success = 'messages.updated';
				error = 'messages.noUpdate';
				break;
			case 'd':
				success = 'messages.deleted';
				error = 'messages.noDeleted';
				break;
		}

		let message;
		let status = 200;
		if (result === 0) {
			message = [ { message: GetHeaderLang.setLanguage(request, error) } ];
			status = 400;
		} else {
			message = [
				{
					message: GetHeaderLang.setLanguage(request, success)
				}
			];
		}
		return { message, status };
	}
}

module.exports = new ResponseService();
