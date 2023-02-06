from flask import Flask, jsonify, request, render_template, Response
app = Flask(__name__)

cars = []

@app.route('/index',methods=['GET'])
def index():
    return render_template('index.html')

@app.route('/car-rent',methods=['GET'])
def car_rent():
    return render_template('car-rent.html')

# GET request to retrieve all cars
@app.route('/cars', methods=['GET'])
def get_cars():
    if not cars:
        return jsonify({'message:':'No cars found in the server'}), 404
    return jsonify({'cars': cars}), 200

# GET request to retrieve one car
@app.route('/cars/<int:id>', methods=['get'])
def get_car(id):
    for car in cars:
        if car['id'] == id:
            return jsonify({'car': car}), 200
    return jsonify({'message:':'Car not found'}), 404

# POST request to add a new contact with data of the new contact on a json file
@app.route('/cars', methods=['POST'])
def add_car():
    if not request.is_json: 
        return jsonify({'message':'body is not a json'}), 415
    data = request.get_json()
    if not data or not all(key in data for key in ('modelo', 'marca','ano','observacoes','diaria','status')):
        return jsonify({'message','bad request'}), 400
    id = 1
    if len(cars) > 0:
        id = cars[-1]["id"] + 1
    car = {
        'id': id,
        'modelo': data['modelo'],
        'marca': data['marca'],
        'ano': data['ano'],
        'observacoes': data['observacoes'],
        'diaria': data['diaria'],
        'status': data['status']
    }
    cars.append(car)
    return jsonify({'car': car}), 201

# PUT request to update a contact
@app.route('/cars/<int:id>', methods=['PUT'])
def update_car(id):
    if not request.is_json: 
        return jsonify({'message':'body is not a json'}), 415
    data = request.get_json()
    if not data or not all(key in data for key in ('modelo', 'marca','ano','observacoes','diaria','status')):
        return jsonify({'message','bad request'}), 400
    for car in cars:
        if id == car['id']:
            car['modelo'] = data['modelo']
            car['marca'] = data['marca'],
            car['ano'] = data['ano'],
            car['observacoes'] = data['observacoes'],
            car['diaria'] = data['diaria'],
            car['status'] = data['status']
            return jsonify({'car': car}), 200
    return jsonify({'message':'Car not found'}), 404

# DELETE request to delete a contact
@app.route('/cars/<int:id>', methods=['DELETE'])
def delete_car(id):
    for i,car in enumerate(cars):
        if id == car['id']:
            del cars[i]
            return jsonify({'message':'Car deleted'}), 200
    return {'message': ''}


app.run(debug=True,port = 5001)
