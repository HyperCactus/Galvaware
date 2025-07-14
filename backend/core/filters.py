import django_filters
from .models import Quote

class QuoteFilter(django_filters.FilterSet):
    status = django_filters.CharFilter(field_name='status', lookup_expr='exact')
    search = django_filters.CharFilter(method='filter_search')

    class Meta:
        model = Quote
        fields = ['status', 'search']

    def filter_search(self, queryset, name, value):
        return queryset.filter(
            django_filters.rest_framework.DjangoFilterBackend().filter_queryset(
                self.request, 
                queryset, 
                self
            ).filter(
                client__name__icontains=value
            ).filter(
                quote_id__icontains=value
            )
        )