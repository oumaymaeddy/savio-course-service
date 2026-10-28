"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoursesService = void 0;
const common_1 = require("@nestjs/common");
const node_crypto_1 = require("node:crypto");
let CoursesService = class CoursesService {
    courses = [
        { id: '1', name: 'Data Structures', code: 'ITI1121', term: 'Fall 2026' },
        { id: '2', name: 'Linear Algebra', code: 'MAT1341', term: 'Fall 2026' },
    ];
    findAll() {
        return this.courses;
    }
    findOne(id) {
        const course = this.courses.find((c) => c.id === id);
        if (!course) {
            throw new common_1.NotFoundException(`Course ${id} not found`);
        }
        return course;
    }
    create(dto) {
        const course = { id: (0, node_crypto_1.randomUUID)(), ...dto };
        this.courses.push(course);
        return course;
    }
};
exports.CoursesService = CoursesService;
exports.CoursesService = CoursesService = __decorate([
    (0, common_1.Injectable)()
], CoursesService);
//# sourceMappingURL=courses.service.js.map