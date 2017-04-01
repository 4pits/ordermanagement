Orders.permit('insert').ifHasRole('buyer').allowInClientCode();
Orders.permit('insert').ifHasRole('admin').allowInClientCode();
Orders.permit('update').ifHasRole('admin').allowInClientCode();
