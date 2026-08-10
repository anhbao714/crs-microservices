package vn.edu.crs.courseservice.controller;

import org.springframework.web.bind.annotation.*;
import vn.edu.crs.courseservice.dto.CourseResponse;
import vn.edu.crs.courseservice.service.CourseService;

@RestController
@RequestMapping("/internal/courses")
public class InternalCourseController {

    private final CourseService courseService;

    public InternalCourseController(CourseService courseService) {
        this.courseService = courseService;
    }

    @PatchMapping("/{id}/reserve-seat")
    public CourseResponse reserveSeat(@PathVariable Long id) {
        return courseService.reserveSeat(id);
    }

    @PatchMapping("/{id}/release-seat")
    public CourseResponse releaseSeat(@PathVariable Long id) {
        return courseService.releaseSeat(id);
    }
}
