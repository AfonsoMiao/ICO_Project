import math
import random
import json

# Not sure to use
from jmetal.core.problem import PermutationProblem
from jmetal.core.solution import PermutationSolution


class CENARIO1(PermutationProblem):
    """ Class representing VHRP1 Problem. """

    def __init__(self, instance: str = None):
        super(CENARIO1, self).__init__()

        distance_matrix, number_of_cities = self.__read_from_data(instance)

        self.distance_matrix = distance_matrix

        self.obj_directions = [self.MINIMIZE]
        self.number_of_variables = number_of_cities
        self.number_of_objectives = 1
        self.number_of_constraints = 0

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
            
            fitness += self.distance_matrix[x][y]

        first_city, last_city = solution.variables[0], solution.variables[-1]
        fitness += self.distance_matrix[first_city][last_city]

        solution.objectives[0] = fitness
   
        return solution


    def create_solution(self) -> PermutationSolution:
        new_solution = PermutationSolution(number_of_variables=self.number_of_variables,
                                           number_of_objectives=self.number_of_objectives)
        new_solution.variables = self.depot + random.sample(range(1,self.number_of_variables), k=self.number_of_variables-1)
        #print("Solution: ", new_solution.variables)
        return new_solution

    @property
    def number_of_cities(self):
        return self.number_of_variables

    def get_name(self):
        return 'Symmetric TSP'
