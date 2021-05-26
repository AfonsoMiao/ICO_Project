import math
import random
import json
import openrouteservice
from openrouteservice import distance_matrix
from jmetal.core.problem import PermutationProblem
from jmetal.core.solution import PermutationSolution


class CENARIO1(PermutationProblem):
    """ Class representing VHRP1 Problem. """

    def __init__(self, instance: str = None):
        super(CENARIO1, self).__init__()

        distance_matrix, number_of_cities, distances_to_warehouse = self.__create_distance_matrix(instance)

        self.distance_matrix = distance_matrix
        self.distances_to_warehouse = distances_to_warehouse
        self.obj_directions = [self.MINIMIZE]
        self.number_of_variables = number_of_cities
        self.number_of_objectives = 1
        self.number_of_constraints = 0

        print("Distance matrix: ", distance_matrix)
        print("Number of cities: ", number_of_cities)


    def __create_distance_matrix(self, data: dict):
        """
        Using API openrouteservice to calculate distance matrix
        """
        print("Data nodes: ", data['data_nodes'])
        self.depot = [0]
        coords = []
        for i in range(len(data['data_nodes'])):
            #print("Tuple: ", (node['latitude'], node['longitude']))
            latitude = float(data['data_nodes'][i]['latitude'])
            longitude = float(data['data_nodes'][i]['longitude'])
            coords.insert(i, (longitude, latitude))

        print("Coordinates: ", coords)
        client = openrouteservice.Client(key='5b3ce3597851110001cf62483b6335326488469988f25ec7319aafb9') # Specify your personal API key
        response_json = client.distance_matrix(coords, metrics=['distance', 'duration'], units="km")
        matrix_distance = response_json['distances']
        matrix_time = response_json['durations']
        number_cities = len(data['data_nodes'])
        distances_to_warehouse = [-1] * (number_cities - 1)
        for i in range(number_cities - 1):
            distances_to_warehouse[i] = matrix_distance[i+1][0]

        print(distances_to_warehouse)
        return matrix_distance, number_cities, distances_to_warehouse

    def __read_from_data(self, data: dict):
        """
        This function reads a TSP Problem instance from a file.

        :param filename: File which describes the instance.
        :type filename: str.
        """

        """ if filename is None:
            raise FileNotFoundError('Filename can not be None')

        with open(filename) as f:
            data = json.load(f) """

        dimension = int(len(data["data"]))
        c = [-1.0] * (2 * dimension)
        delivery_points_x = [-1] * (dimension)
        delivery_points_y = [-1] * (dimension)
        for item in data["data"]:
            j = int(item["node"])
            if item["depot"] == "true":
                self.depot = [j-1]
            #c[2 * (j - 1)] = float(item["latitude"])
            #c[2 * (j - 1) + 1] = float(item["longitude"])
            delivery_points_x[j-1] = float(item["latitude"])
            delivery_points_y[j-1] = float(item["longitude"])

        print("delivety points x: ", delivery_points_x)
        print("delivety points y: ", delivery_points_y)

        matrix = [[-1] * dimension for _ in range(dimension)]

        for k in range(dimension):
            matrix[k][k] = 0

            for j in range(k + 1, dimension):
                #dist = math.sqrt((c[k * 2] - c[j * 2]) ** 2 + (c[k * 2 + 1] - c[j * 2 + 1]) ** 2)
                dist = math.sqrt((delivery_points_x[k] - delivery_points_x[j]) ** 2 + (delivery_points_y[k] - delivery_points_y[j]) ** 2)
                #dist = round(dist)
                matrix[k][j] = dist
                matrix[j][k] = dist
        print(matrix)
        print(dimension)
        return matrix, dimension

    def evaluate(self, solution: PermutationSolution) -> PermutationSolution:
        fitness = 0

        for i in range(self.number_of_variables - 1):
            x = solution.variables[i]
            y = solution.variables[i + 1]

            if i == 0 and x != 0:
                fitness += 9999999

            fitness += self.distance_matrix[x][y]

        first_city, last_city = solution.variables[0], solution.variables[-1]
        fitness += self.distance_matrix[first_city][last_city]

        solution.objectives[0] = fitness
   
        return solution


    def create_solution(self) -> PermutationSolution:
        new_solution = PermutationSolution(number_of_variables=self.number_of_variables,
                                           number_of_objectives=self.number_of_objectives)
        new_solution.variables = self.depot + random.sample(range(1,self.number_of_variables), k=self.number_of_variables-1)
        return new_solution

    @property
    def number_of_cities(self):
        return self.number_of_variables

    def get_name(self):
        return 'Symmetric TSP'
