<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StorePostRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'body'       => ['required', 'string', 'max:5000'],
            'visibility' => ['required', 'in:public,private'],
            'image'      => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
        ];
    }

    /**
     * @return array|string[]
     */
    public function messages(): array
    {
        return [
            'body.required'       => 'Post body is required.',
            'body.max'            => 'Post body cannot exceed 5000 characters.',
            'visibility.required' => 'Visibility is required.',
            'visibility.in'       => 'Visibility must be either public or private.',
            'image.image'         => 'The file must be an image.',
            'image.mimes'         => 'Only jpg, jpeg, png and webp images are allowed.',
            'image.max'           => 'Image size cannot exceed 2MB.',
        ];
    }
}
