<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Aso extends Model
{
    use HasFactory;

    protected $table = 'tb_aso';
    protected $primaryKey = 'id_aso';
    protected $fillable = ['Clase'];
}