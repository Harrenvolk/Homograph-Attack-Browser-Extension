from flask import Flask, jsonify, request
from flask_restful import Resource, Api
from kdtree import query
  
app = Flask(__name__)
api = Api(app)
  
class HomographCheck(Resource):
    def get(self):
        list_of_suggestions = query(request.args.get('url'))[0:2]
        message = {'status': 200, 'suggestions': list_of_suggestions}
        return jsonify(message)
  
api.add_resource(HomographCheck, '/')
  
if __name__ == '__main__':
    app.run(port=5335, debug = True)