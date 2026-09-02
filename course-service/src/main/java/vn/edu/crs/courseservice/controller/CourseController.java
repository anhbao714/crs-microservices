package vn.edu.crs.courseservice.controller;

import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import vn.edu.crs.courseservice.dto.CourseRequest;
import vn.edu.crs.courseservice.dto.CourseResponse;
import vn.edu.crs.courseservice.service.CourseService;

@RestController
@RequestMapping("/courses")
public class CourseController {

    private final CourseService courseService;

    public CourseController(CourseService courseService) {
        this.courseService = courseService;
    }

    @GetMapping
    public Page<CourseResponse> search(
            @RequestParam(required = false) String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "9") int size) {
        System.out.println("\n=== [CourseController.search] START ===");
        System.out.println("Received params: keyword='" + keyword + "', page=" + page + ", size=" + size);
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.ASC, "id"));
        System.out.println("Pageable created: pageNumber=" + pageable.getPageNumber() + ", pageSize=" + pageable.getPageSize() + ", offset=" + pageable.getOffset());
        Page<CourseResponse> result = courseService.search(keyword, pageable);
        System.out.println("Result: returned " + result.getContent().size() + " items, totalElements=" + result.getTotalElements() + ", totalPages=" + result.getTotalPages());
        System.out.println("=== [CourseController.search] END ===\n");
        return result;
    }

    @GetMapping("/{id}")
    public CourseResponse getCourseById(@PathVariable Long id) {
        return courseService.getCourseById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public CourseResponse createCourse(@Valid @RequestBody CourseRequest request) {
        return courseService.createCourse(request);
    }

    @PutMapping("/{id}")
    public CourseResponse updateCourse(@PathVariable Long id, @Valid @RequestBody CourseRequest request) {
        return courseService.updateCourse(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteCourse(@PathVariable Long id) {
        courseService.deleteCourse(id);
    }
}
