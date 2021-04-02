from django.db import models

# Create your models here.
class CentroDeFornecimento(models.Model):
    longitude = models.DecimalField(max_digits = 10, decimal_places = 10)
    latitude = models.DecimalField(max_digits = 10, decimal_places = 10)

    def _str_(self):
        return (self.longitude, self.latitude)

class PontoDeEntrega(models.Model):
    longitude = models.DecimalField(max_digits = 10, decimal_places = 10)
    latitude = models.DecimalField(max_digits = 10, decimal_places = 10)
    carga = models.IntegerField()
    prioridade = models.IntegerField()

    def _str_(self):
        return (self.longitude, self.latitude)

class Veiculo(models.Model):
    capacidade = models.IntegerField()
    consumo = models.DecimalField(max_digits = 10, decimal_places = 2)


    def _str_(self):
        field_values = []
        for field in self._meta.get_all_field_names():
            field_values.append(getattr(self, field, ''))
        return ' '.join(field_values)